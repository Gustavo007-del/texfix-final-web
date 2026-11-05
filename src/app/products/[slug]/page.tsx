import {notFound} from 'next/navigation';
import {findProduct,products} from '../../../data/catalogue';
import ProductDetail from '../../../components/business/ProductDetail';
export function generateStaticParams(){return products.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const p=findProduct((await params).slug);
  return {title:(p?.name||'Product')+' | TEXFIX'};
}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const p=findProduct((await params).slug);
  if(!p) notFound();
  return <ProductDetail product={p}/>;
}
