import {services} from '@/data/catalogue';
export default function Services(){return <main className="collections"><small>TECHNICIAN SERVICES</small><h2>Professional help for your home.</h2><div className="tiles">{services.map(s=><a href={'/services/'+s.slug} key={s.slug}><small>{s.group}</small><h3>{s.name}</h3><p>{s.description}</p>Explore service →</a>)}</div></main>}
