'use client';

import Link from 'next/link';
import {useState} from 'react';
import Product3DViewer from '../scene/Product3DViewer';
import {categoryName, productImage, productModel, type Product} from '../../data/catalogue';
import './business.css';

const swatches:Record<string,string>={'Brushed gold':'#b29157','Chrome':'#b9bfc2','Matte black':'#363635','Ivory porcelain':'#ece5d6','Brushed stainless steel':'#9a9e9e','Brass':'#a78342','Smoked amber & brushed gold':'#885221'};
export default function ProductDetail({product}:{product:Product}){
  const [finish,setFinish]=useState(product.finishes[0]);
  return <main className="business"><div className="biz-shell">
    <Link className="biz-back" href="/products">← &nbsp; Back to collection</Link>
    <div className="biz-detail">
      <section aria-label={product.name+' in 3D'} className="biz-viewer"><Product3DViewer name={product.name} model={productModel(product)} image={productImage(product)} finish={finish}/></section>
      <section className="biz-detail-copy"><div className="biz-kicker"><span/>{categoryName(product.categories[0])} / {product.type}</div><h1 className="biz-detail-title">{product.name}<span>.</span></h1>
        <p className="biz-lead">{product.description}</p><p>{product.detail}</p>
        <fieldset className="biz-finishes"><legend>{product.finishes.length>1?'Preview a finish':'Model finish'}</legend><div>{product.finishes.map(f=><button type="button" key={f} aria-pressed={finish===f} onClick={()=>setFinish(f)}><i style={{background:swatches[f]}}/>{f}</button>)}</div></fieldset>
        {product.brand&&<p>Brand: {product.brand}</p>}{product.price&&<p>{product.price}</p>}
        <p className="biz-note">Sample product and finish study. Enquire with TexFix to confirm actual inventory and options.</p>
        <div className="biz-actions"><Link className="biz-btn" href={'/enquiry?product='+product.slug}>Enquire about product <span>↗</span></Link><Link className="biz-btn secondary" href={'/request?service='+product.service+'&product='+product.slug}>Request fitting assistance <span>→</span></Link></div>
      </section>
    </div>
  </div></main>;
}
