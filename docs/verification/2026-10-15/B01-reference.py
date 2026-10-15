"""Independent 60-digit Boltzmann occupations: no JavaScript or production imports."""
from decimal import Decimal as D, getcontext
import json
from pathlib import Path

getcontext().prec = 60
h,k,gamma=D('6.62607015e-34'),D('1.380649e-23'),D('42577478.92')
def calculate(b,t):
    # Energies 0 and gap: normalized exp(-E/kT), rather than tanh.
    excited=(-h*gamma*b/(k*t)).exp()
    lower=1/(1+excited)
    upper=excited/(1+excited)
    return lower,upper,lower-upper
reference=calculate(D(3),D(310))[2]
rows=[]
for b in ['0','0.1','1.5','3','5','7']:
    for t in ['250','270','300','310','370','400']:
        lower,upper,p=calculate(D(b),D(t))
        rows.append(dict(b0=float(b),temperatureK=float(t),lower=str(lower),upper=str(upper),polarization=str(p),relativeM0=str(p/reference)))
out=Path(__file__).with_name('B01-reference.json')
out.write_text(json.dumps(dict(method='Python Decimal(60), E_low=0, E_high=h*gamma*B0, normalized Boltzmann weights',rows=rows),indent=2)+'\n',encoding='utf-8')
print(f'{len(rows)} independent thermal states saved to {out.name}')
