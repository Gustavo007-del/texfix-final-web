import './style.css';
import ScrollMotion from '@/components/ScrollMotion';
import {ArrowUpRight,Search,Menu} from 'lucide-react';
export const metadata={title:'TEXFIX — Complete Home Solutions',description:'Explore the home showroom and request professional fitting services in Kozhikode.'};
const links=[['Home','/'],['Products','/products'],['Services','/services'],['Showroom','/#showroom'],['About','/#about'],['Contact','/#contact']];
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><ScrollMotion/><header><a className="brand" href="/">TEXFIX<span>COMPLETE HOME SOLUTIONS</span></a><nav>{links.map(([n,h])=><a key={n} href={h}>{n}</a>)}</nav><a className="search" href="/products#search" aria-label="Search products"><Search size={19}/></a><a className="book" href="/request">Request Technician <ArrowUpRight size={15}/></a><details className="mobile"><summary aria-label="Navigation"><Menu/></summary><div>{links.map(([n,h])=><a key={n} href={h}>{n}</a>)}</div></details></header>{children}<footer id="contact"><b>TEXFIX</b><span>East Nadakkave, Kozhikode, Kerala, India</span><a href="/request">Request a technician ↗</a></footer></body></html>}

