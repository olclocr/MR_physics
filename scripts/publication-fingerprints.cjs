'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
function normalizeText(bytes){
 const text=bytes.toString('utf8');
 // A byte-preserving UTF-8 round trip is required. Do not silently replace
 // invalid bytes, strip a BOM, normalize Unicode, or add a final newline.
 if(!Buffer.from(text,'utf8').equals(bytes))return null;
 return Buffer.from(text.replace(/\r\n/g,'\n'),'utf8');
}
function crlfPositions(bytes){
 const positions=[];let offset=0;
 for(let j=0;j<bytes.length;j++,offset++)if(bytes[j]===13&&bytes[j+1]===10){positions.push(offset);j++;}
 return positions;
}
function reconstructReviewedBytes(publishedBytes,positions){
 const normalized=normalizeText(publishedBytes);if(!normalized||!Array.isArray(positions))return null;
 let previous=-1;for(const p of positions){if(!Number.isInteger(p)||p<=previous||normalized[p]!==10)return null;previous=p;}
 const out=Buffer.alloc(normalized.length+positions.length);let target=0,next=0;
 for(let source=0;source<normalized.length;source++){if(source===positions[next]){out[target++]=13;next++;}out[target++]=normalized[source];}
 return out;
}
function compareFingerprint(reviewedSha256,reviewedBytes,publishedBytes,recordedPositions){
 const expected=String(reviewedSha256).toUpperCase();if(!/^[A-F0-9]{64}$/.test(expected))throw Error('Invalid reviewed SHA-256');
 const publishedSha256=sha(publishedBytes),availableReviewSha256=reviewedBytes?sha(reviewedBytes):null;
 let status,reviewCRLFPositions,reviewBytesSource;
 if(publishedSha256===expected){status='exact';reviewBytesSource='published_hash_match';}
 else if(availableReviewSha256===expected){
  const a=normalizeText(reviewedBytes),b=normalizeText(publishedBytes);
  status=a&&b&&a.equals(b)?'line_endings_only':'content_changed';
  reviewBytesSource='sha_confirmed_local';
  if(status==='line_endings_only')reviewCRLFPositions=crlfPositions(reviewedBytes);
 }else{
  const reconstructed=reconstructReviewedBytes(publishedBytes,recordedPositions);
  if(reconstructed&&sha(reconstructed)===expected){status='line_endings_only';reviewCRLFPositions=recordedPositions;reviewBytesSource='reconstructed_from_record';}
  else{status='review_bytes_unavailable';reviewBytesSource='unavailable';}
 }
 return{status,reviewBytesSource,reviewedSha256:expected,availableReviewSha256,publishedSha256,...(reviewCRLFPositions?{reviewCRLFPositions}: {})};
}
function repositoryPath(value){
 if(typeof value!=='string'||!value||path.isAbsolute(value)||value.includes('\0'))throw Error('Expected a repository-relative path');
 const normalized=value.replace(/\\/g,'/');if(normalized.split('/').some(s=>s==='..'||s==='.'||!s))throw Error('Noncanonical repository path: '+value);return normalized;
}
function auditCommit({root=process.cwd(),reviewRoot=root,commit,manifests,readBlob,priorAudit}){
 if(!/^[0-9a-f]{40}$/i.test(commit||''))throw Error('Use an explicit 40-character commit SHA');
 if(!Array.isArray(manifests)||!manifests.length)throw Error('At least one manifest is required');
 if(priorAudit&&priorAudit.commit!==commit)throw Error('Prior audit must name the same commit');
 root=path.resolve(root);reviewRoot=path.resolve(reviewRoot);const cache=new Map();
 const load=readBlob||((ref,file)=>execFileSync('git',['show',ref+':'+file],{cwd:root,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}));
 const blob=file=>{file=repositoryPath(file);if(!cache.has(file))cache.set(file,load(commit,file));return cache.get(file);};
 const files=[];
 for(const supplied of manifests){
  const manifest=repositoryPath(supplied),data=JSON.parse(blob(manifest).toString('utf8').replace(/^\uFEFF/,''));
  if(!Array.isArray(data.files)||!data.files.length)throw Error('Manifest has no reviewed files: '+manifest);
  for(const entry of data.files){
   const file=repositoryPath(entry.path),local=path.join(reviewRoot,file),reviewedBytes=fs.existsSync(local)?fs.readFileSync(local):null;
   const prior=priorAudit?.files?.find(f=>f.manifest===manifest&&f.path===file);
   files.push({manifest,path:file,...compareFingerprint(entry.sha256,reviewedBytes,blob(file),prior?.reviewCRLFPositions)});
  }
 }
 const counts=files.reduce((s,f)=>(s[f.status]=(s[f.status]||0)+1,s),{}),failures=files.filter(f=>!['exact','line_endings_only'].includes(f.status));
 return{commit,manifests:manifests.map(repositoryPath),method:'Compare commit manifests/blobs to SHA-confirmed review bytes; recorded CRLF byte offsets permit exact reconstruction from normalized UTF-8',counts,passed:failures.length===0,files};
}
function parseArgs(args){
 const result={manifests:[]};for(let i=0;i<args.length;i++){
  const key=args[i];if(!['--commit','--manifest','--review-root','--prior-audit','--output'].includes(key)||!args[i+1]||args[i+1].startsWith('--'))throw Error('Unknown or incomplete option: '+key);
  const value=args[++i];if(key==='--manifest')result.manifests.push(value);else result[key==='--review-root'?'reviewRoot':key==='--prior-audit'?'priorAudit':key.slice(2)]=value;
 }
 return result;
}
if(require.main===module){
 try{const{output,priorAudit,...options}=parseArgs(process.argv.slice(2)),result=auditCommit({...options,priorAudit:priorAudit?JSON.parse(fs.readFileSync(priorAudit,'utf8')):undefined}),json=JSON.stringify(result,null,2)+'\n';if(output)fs.writeFileSync(output,json);console.log(JSON.stringify({commit:result.commit,counts:result.counts,passed:result.passed}));if(!result.passed)process.exitCode=1;}
 catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={compareFingerprint,auditCommit,parseArgs,reconstructReviewedBytes};
