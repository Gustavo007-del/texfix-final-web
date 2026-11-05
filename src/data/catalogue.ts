export const categories = [
  ['bathroom', 'Bathroom'], ['sanitaryware', 'Sanitaryware'], ['faucets', 'Faucets'],
  ['showers', 'Showers'], ['kitchenware', 'Kitchenware'], ['plumbing', 'Plumbing'],
  ['accessories', 'Accessories'],
] as const;
export type Category = (typeof categories)[number][0];
export const categoryName = (id: string) => categories.find(([key]) => key === id)?.[1] ?? 'All products';

export const services = [
  {slug:'plumbing',name:'Plumbing maintenance',group:'Plumbing',description:'Get help with leaks, drainage issues and household water connections.'},
  {slug:'pipe-fitting',name:'Pipe fitting & replacement',group:'Plumbing',description:'Request assistance with worn pipes, connectors and replacement fittings.'},
  {slug:'washbasin',name:'Washbasin installation & care',group:'Bathroom',description:'Request help fitting a basin or maintaining its waste outlet and water connections.'},
  {slug:'toilet',name:'Toilet & closet maintenance',group:'Bathroom',description:'Arrange assistance with installation, flush mechanisms and sanitary connections.'},
  {slug:'shower',name:'Shower installation & care',group:'Bathroom',description:'Request help installing a shower head, fitting its controls or maintaining an existing system.'},
  {slug:'faucet',name:'Faucet installation & repair',group:'Bathroom',description:'Get help with fitting a new tap, replacing a connection or repairing a leak.'},
  {slug:'kitchen-sink',name:'Kitchen sink installation',group:'Kitchen',description:'Request assistance with a sink installation, waste outlet or water connection.'},
  {slug:'kitchen-fitting',name:'Kitchen fitting maintenance',group:'Kitchen',description:'Get help maintaining kitchen taps, fittings and sink connections.'},
  {slug:'sanitaryware',name:'Sanitaryware installation & repair',group:'Bathroom',description:'Request installation or maintenance for sanitary fittings in your bathroom.'},
  {slug:'general',name:'General fitting maintenance',group:'Home',description:'Describe a household fitting that needs attention so the service team can assess your request.'},
] as const;

export type Product = {
  slug:string; name:string; type:string; asset:string; categories:Category[];
  description:string; detail:string; finishes:string[]; service:string;
  brand?:string; price?:string;
};

export const products: Product[] = [
  {slug:'arc-basin-mixer',name:'Arc basin mixer',type:'Basin faucet',asset:'faucet',categories:['faucets','bathroom'],description:'A sculpted basin tap with a gently curved spout and a compact profile.',detail:'Explore the spout, handle and mounting profile from different angles.',finishes:['Brushed gold','Chrome','Matte black'],service:'faucet'},
  {slug:'oval-vessel-basin',name:'Oval vessel basin',type:'Countertop washbasin',asset:'basin',categories:['bathroom','sanitaryware'],description:'A softly rounded vessel basin with an open bowl and a smooth ceramic finish.',detail:'Inspect the rim, bowl shape and countertop contact surface.',finishes:['Ivory porcelain'],service:'washbasin'},
  {slug:'rain-shower-system',name:'Rain shower system',type:'Overhead shower',asset:'shower',categories:['showers','bathroom'],description:'An overhead rainfall shower with a coordinated rail and controls.',detail:'Rotate the assembly to explore the shower head and wall connection.',finishes:['Chrome','Matte black','Brushed gold'],service:'shower'},
  {slug:'forma-closet',name:'Forma closet',type:'Ceramic sanitaryware',asset:'toilet',categories:['sanitaryware','bathroom'],description:'A contemporary ceramic closet with a rounded profile and closely fitted seat.',detail:'Inspect the bowl, seat and overall outline in the viewer.',finishes:['Ivory porcelain'],service:'toilet'},
  {slug:'single-bowl-sink',name:'Single bowl sink',type:'Kitchen sink',asset:'sink',categories:['kitchenware'],description:'A stainless steel kitchen bowl with a clean rim and a recessed drain.',detail:'Look into the bowl or rotate the sink to inspect its edges and outlet.',finishes:['Brushed stainless steel'],service:'kitchen-sink'},
  {slug:'swan-kitchen-mixer',name:'Swan kitchen mixer',type:'Kitchen faucet',asset:'kitchen-faucet',categories:['kitchenware','faucets'],description:'A high spout kitchen mixer that leaves space beneath its curved neck.',detail:'Preview the finish and inspect the spout and handle profile.',finishes:['Matte black','Brushed gold','Chrome'],service:'kitchen-fitting'},
  {slug:'service-valve',name:'Service valve',type:'Plumbing fitting',asset:'valve',categories:['plumbing'],description:'A compact valve for a household water connection.',detail:'Inspect the connections and handle orientation from each side.',finishes:['Brass'],service:'pipe-fitting'},
  {slug:'amber-dispenser',name:'Amber dispenser',type:'Vanity accessory',asset:'accessory',categories:['accessories','bathroom'],description:'A smoked amber vessel with a contrasting metal pump for the vanity.',detail:'Explore the shape of the bottle and the finish on the pump.',finishes:['Smoked amber & brushed gold'],service:'general'},
];
export const findProduct = (slug?:string) => products.find(p=>p.slug===slug);
export const findService = (slug?:string) => services.find(s=>s.slug===slug);
export const productImage = (p:Product) => '/images/'+p.asset+'.jpg';
export const productModel = (p:Product) => '/models/'+p.asset+'.glb';
export const modes = ['Installation','Maintenance or repair'] as const;

