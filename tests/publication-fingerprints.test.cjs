'use strict';
const{test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),{compareFingerprint,auditCommit,parseArgs,reconstructReviewedBytes}=require('../scripts/publication-fingerprints.cjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
test('fingerprints accept only SHA-confirmed CRLF/LF differences and reject material or unavailable review bytes',()=>{
 const original=Buffer.from('const rate = 50;\r\n// reviewed\n'),normalized=Buffer.from('const rate = 50;\n// reviewed\n'),changed=Buffer.from('const rate = 51;\n// reviewed\n');
 assert.equal(compareFingerprint(sha(original),original,original).status,'exact');
 assert.equal(compareFingerprint(sha(original),original,normalized).status,'line_endings_only');
 assert.equal(compareFingerprint(sha(original),original,changed).status,'content_changed');
 assert.equal(compareFingerprint(sha(original),changed,normalized).status,'review_bytes_unavailable');
 assert.equal(compareFingerprint(sha(original),null,normalized).status,'review_bytes_unavailable');
 assert.equal(compareFingerprint(sha(normalized),changed,normalized).status,'exact');
 assert.equal(compareFingerprint(sha(original),original,Buffer.from('const rate = 50;\n// reviewed')).status,'content_changed');
 const binary=Buffer.from([255,13,10]);assert.equal(compareFingerprint(sha(binary),binary,Buffer.from([255,10])).status,'content_changed');
 const unicode=Buffer.from('자화\r\n신호\n'),lf=Buffer.from('자화\n신호\n'),record=compareFingerprint(sha(unicode),unicode,lf);
 assert.deepEqual(reconstructReviewedBytes(lf,record.reviewCRLFPositions),unicode);
 assert.equal(compareFingerprint(sha(unicode),null,lf,record.reviewCRLFPositions).reviewBytesSource,'reconstructed_from_record');
 assert.equal(compareFingerprint(sha(unicode),null,Buffer.from('자화\n신호2\n'),record.reviewCRLFPositions).status,'review_bytes_unavailable');
 assert.equal(reconstructReviewedBytes(lf,[0]),null);assert.equal(reconstructReviewedBytes(lf,[6,6]),null);
});
test('publication audit reads the named commit manifest and detects dirty unavailable original bytes',t=>{
 const tempRoot=path.resolve(os.tmpdir()),root=fs.mkdtempSync(path.join(tempRoot,'mr-publication-fingerprints-'));
 t.after(()=>{const relative=path.relative(tempRoot,root);assert.ok(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative)&&path.basename(root).startsWith('mr-publication-fingerprints-'));fs.rmSync(root,{recursive:true,force:true});});
 const commit='a'.repeat(40),review=Buffer.from('signal = 1;\r\n'),objects={'model.js':Buffer.from('signal = 1;\n'),'versions.json':Buffer.from(JSON.stringify({files:[{path:'model.js',sha256:sha(review)}]}))};
 const readBlob=(ref,file)=>{assert.equal(ref,commit);assert.ok(objects[file]);return objects[file];};
 fs.writeFileSync(path.join(root,'model.js'),review);fs.writeFileSync(path.join(root,'versions.json'),'{}');
 const options={root,commit,manifests:['versions.json'],readBlob};const valid=auditCommit(options);assert.equal(valid.passed,true);assert.equal(valid.counts.line_endings_only,1);
 fs.writeFileSync(path.join(root,'model.js'),'signal = 2;\r\n');assert.equal(auditCommit(options).passed,false);
 const replay=auditCommit({...options,priorAudit:valid});assert.equal(replay.passed,true);assert.equal(replay.files[0].reviewBytesSource,'reconstructed_from_record');
 assert.throws(()=>auditCommit({...options,manifests:['../versions.json']}),/Noncanonical/);assert.throws(()=>auditCommit({...options,commit:'main'}),/explicit/);
});
test('publication CLI requires complete known options',()=>{
 assert.deepEqual(parseArgs(['--commit','a'.repeat(40),'--manifest','a.json','--manifest','b.json','--output','result.json']),{commit:'a'.repeat(40),manifests:['a.json','b.json'],output:'result.json'});
 assert.throws(()=>parseArgs(['--output']),/incomplete/);assert.throws(()=>parseArgs(['--unknown','x']),/Unknown/);
});
