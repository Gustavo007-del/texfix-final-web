'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {categories, categoryName, products, productImage} from '../../data/catalogue';
import './business.css';

export default function Catalogue({initialCategory,initialQuery}:{initialCategory:string;initialQuery:string}) {
  const [category,setCategory]=useState(initialCategory);
  const [query,setQuery]=useState(initialQuery);
  useEffect(()=>{
    function restore(){
      const params=new URLSearchParams(window.location.search);
      setCategory(params.get('category')||'all');
      setQuery(params.get('q')||'');
    }
    window.addEventListener('popstate',restore);
    return ()=>window.removeEventListener('popstate',restore);
  },[]);
  function filter(nextCategory:string,nextQuery:string) {
    setCategory(nextCategory);setQuery(nextQuery);
    const url=new URL(window.location.href);
    if(nextCategory==='all') url.searchParams.delete('category');
    else url.searchParams.set('category',nextCategory);
    if(nextQuery.trim()) url.searchParams.set('q',nextQuery);
    else url.searchParams.delete('q');
    window.history.replaceState(null,'',url);
  }
  const terms=query.toLowerCase().trim().split(/\s+/);
  const visible=products.filter(p=>{
    const words=[p.name,p.type,p.description,...p.finishes,...p.categories.map(categoryName)].join(' ').toLowerCase();
    return (category==='all'||p.categories.some(c=>c===category)) && terms.every(term=>words.includes(term));
  });
  return <main className="business catalogue">
    <div className="biz-shell">
      <div className="biz-kicker"><span/> Product showroom</div>
      <h1 className="biz-title">The product collection<span>.</span></h1>
      <p className="biz-lead">Discover fittings for the bathroom, kitchen and the connections in between.</p>
      <div className="biz-toolbar">
        <label className="biz-search"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input id="search" type="search" placeholder="Search products or finishes" aria-label="Search products or finishes" value={query} onChange={e=>filter(category,e.target.value)}/></label>
        <div className="biz-filters" aria-label="Product categories">{[['all','All products'],...categories].map(([key,label])=><button key={key} aria-pressed={category===key} onClick={()=>filter(key,query)}>{label}</button>)}</div>
      </div>
      <div className="biz-meta"><span aria-live="polite">{String(visible.length).padStart(2,'0')} {visible.length===1?'product':'products'}</span><span>Sample collection · Enquire for availability</span></div>
      <div className="biz-grid">{visible.map(p=><Link className="biz-card" key={p.slug} href={'/products/'+p.slug}>
        <div className="biz-card-photo"><img loading="lazy" src={productImage(p)} alt={p.name}/><span className="biz-cube">◇ &nbsp; View in 3D</span></div>
        <div className="biz-card-details"><div><small>{p.type}</small><h2>{p.name}</h2></div><span aria-hidden="true" className="biz-diagonal">↗</span></div>
      </Link>)}</div>
      {!visible.length && <div className="biz-empty"><h2>No products found.</h2><p>Try another term or browse the complete collection.</p><button className="biz-btn" onClick={()=>filter('all','')}>Clear filters <span>↗</span></button></div>}
    </div>
  </main>;
}

