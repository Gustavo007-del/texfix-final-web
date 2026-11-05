import Catalogue from '../../components/business/Catalogue';
import {categories} from '../../data/catalogue';
export const metadata={title:'Product collection | TEXFIX'};
export default async function ProductsPage({searchParams}:{searchParams:Promise<{category?:string;q?:string}>}){
  const params=await searchParams;
  const category=categories.find(([key])=>key===params.category?.toString().toLowerCase())?.[0]||'all';
  return <Catalogue key={JSON.stringify(params)} initialCategory={category} initialQuery={typeof params.q==='string'?params.q:''}/>;
}
