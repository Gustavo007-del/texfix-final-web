# TEXFIX
Standalone Next.js 16 showroom with eight editable sample products and ten service categories.

Run `npm ci`, then `npm run dev`. For a production server run `npm run build` and `npm start`. Open the URL printed by Next.

The landing photograph is editorial artwork. The interactive showroom and product views load original Blender exports. Scroll through the live showroom or use its destination selector. Product pages support orbit, zoom, reset and sample finish selection.

Open `blender/TEXFIX_MASTER.blend` in Blender 5.2. The collections separate architecture, fittings, lighting and cameras. Source textures are packed. To regenerate the master, individual GLBs and catalogue renders, run Blender in background with `-P blender/build_showroom.py`. Regeneration replaces the generated master, so save hand edits separately.

Replace inventory and service definitions in `src/data/catalogue.ts`. The catalogue deliberately omits commercial availability, prices and brands until supplied.

Technician requests and product enquiries POST to `/api/requests`. Successful submissions are stored as JSON with a reference UUID. Uploaded photos live alongside records outside the public directory. Set `TEXFIX_DATA_DIR` to a persistent private directory for deployment, or use the default `.texfix-data` on a persistent Node host. Staff can review those files directly. Email delivery, scheduling and dispatch are not configured.

