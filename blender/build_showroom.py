"""Build the TexFix gallery from metric primitives. Run with Blender 5.x in background."""
import bpy, math, random, sys, os
import numpy as np
from pathlib import Path
from mathutils import Vector
from math import sin, cos, pi
ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / "public/models"
IMAGES = ROOT / "public/images"
random.seed(244)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.world = bpy.data.worlds.new("Courtyard daylight")
scene.world.use_nodes=True
scene.world.node_tree.nodes["Background"].inputs[0].default_value=(.8,.86,.94,1)
scene.world.node_tree.nodes["Background"].inputs[1].default_value=.65
COLLS="Home_Environment Bathroom Shower_Area Kitchen Utility_Area Washbasins Toilets Faucets Shower_Systems Kitchen_Sinks Plumbing_Fittings Accessories Technician_Environment Lighting Cameras".split()
def coll(n):
    c=bpy.data.collections.new(n); scene.collection.children.link(c);return c
cols={n:coll(n) for n in COLLS}
C="Home_Environment"
def ob(name,data):
    a=bpy.data.objects.new(name,data);cols[C].objects.link(a);return a
def color(h):
    v=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(((x+.055)/1.055)**2.4 if x>.04045 else x/12.92 for x in v)+(1,)
def mat(name,hex,r=.5,m=0):
    a=bpy.data.materials.new(name);a.diffuse_color=color(hex);a.use_nodes=True
    bs=a.node_tree.nodes.get("Principled BSDF");bs.inputs["Base Color"].default_value=color(hex);bs.inputs["Roughness"].default_value=r;bs.inputs["Metallic"].default_value=m
    return a
def texture(name,base,kind):
    m=mat(name,base,.50 if kind=='wood' else .62)
    rng=np.random.default_rng(8 if kind=='wood' else 42)
    sz=512
    x,y=np.meshgrid(np.linspace(0,1,sz,endpoint=False),np.linspace(0,1,sz,endpoint=False))
    # Periodic, multiscale wavetrains keep panel grain continuous across UV borders.
    d=np.zeros_like(x)
    if kind=='wood':
        bend=.02*np.sin(y*pi*2)+.009*np.sin(y*pi*8)+.004*np.cos(x*pi*4)
        for freq,weight in ((7,.12),(18,.09),(38,.095),(81,.06),(178,.035)):
            d+=weight*np.sin(2*pi*freq*(x+bend)+rng.uniform(0,6))
        d+=rng.normal(0,.02,(sz,sz))
    else:
        for freq,weight in ((1,.038),(2,.034),(5,.022),(10,.02),(21,.023),(66,.012)):
            d+=weight*np.cos((np.sin(x*2*pi)*.35 + y)*freq*2*pi +rng.uniform(0,6))
        d+=rng.normal(0,.038,(sz,sz))
        pores=rng.random((sz,sz))
        d-=np.where(pores>.984,.24,0)
    rgb=np.array([int(base[i:i+2],16)/255 for i in (0,2,4)])
    pix=np.ones((sz,sz,4),np.float32); pix[:,:,:3]=np.clip(rgb*(1+d[:,:,None]),0,1)
    im=bpy.data.images.new(name+" | seamless",sz,sz,alpha=False)
    im.pixels.foreach_set(pix.ravel());im.filepath_raw=str(ROOT/"blender"/(kind+".png"));im.file_format="PNG";im.save();im.pack()
    n=m.node_tree.nodes.new("ShaderNodeTexImage");n.image=im
    m.node_tree.links.new(n.outputs["Color"],m.node_tree.nodes["Principled BSDF"].inputs["Base Color"])
    return m
stone=texture("Honed vein-cut limestone","C3AE94","stone")
wood=texture("Quarter-sawn walnut","805A41","wood")
wall=mat("Clay limewash","DFD1BC",.91)
ivory=mat("Warm white porcelain","F6F3EA",.19)
white=mat("Linen white","E7DFCE",.81)
oak=mat("Oiled teak","976647",.48)
black=mat("Finish_MatteBlack","272925",.32,.67)
gold=mat("Finish_BrushedGold","C99B55",.25,.91)
chrome=mat("Finish_Chrome","CED0CB",.115,.99)
steel=mat("Finish_Steel","A3A8A4",.29,.88)
dark=mat("Gaskets and reveal","272823",.67)
mirror=mat("Silvered mirror","EFF1EC",.026,1)
glass=mat("Low-iron glazing","DCEFEB",.075)
bs=glass.node_tree.nodes["Principled BSDF"];bs.inputs["Transmission Weight"].default_value=.92;bs.inputs["Alpha"].default_value=.2
glass.surface_render_method="DITHERED"
amber=mat("Smoked amber glass","6B3F24",.18)
green=mat("Olive foliage","506644",.60)
leaflight=mat("New olive foliage","718357",.64)
copper=mat("Copper pipe","AA714D",.35,.77)
cloth=mat("Graphite work twill","3B4643",.87)
shirt=mat("Indigo cotton","384E56",.91)
skin=mat("Warm skin","AA7855",.68)
lamp=mat("Warm diffused light","FFF3CA",.31)
bs=lamp.node_tree.nodes["Principled BSDF"];bs.inputs["Emission Color"].default_value=color("FFE7AD");bs.inputs["Emission Strength"].default_value=3
def mesh(name,verts,faces,material,smooth=False):
    data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.materials.append(material);data.update()
    if smooth:
        for p in data.polygons:p.use_smooth=True
    return ob(name,data)
def box(name,p,dim,material,r=.015):
    a,b,c=[d/2 for d in dim]
    verts=[(-a,-b,-c),(a,-b,-c),(a,b,-c),(-a,b,-c),(-a,-b,c),(a,-b,c),(a,b,c),(-a,b,c)]
    faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    o=mesh(name,verts,faces,material);o.location=p
    uv=o.data.uv_layers.new()
    for poly in o.data.polygons:
        for idx,uvcoord in zip(poly.loop_indices,((0,0),(1,0),(1,1),(0,1))):uv.data[idx].uv=uvcoord
    if r:
        mod=o.modifiers.new("Softly eased edges","BEVEL");mod.width=min(r,min(dim)*.43);mod.segments=3
        mod=o.modifiers.new("Planar normals","WEIGHTED_NORMAL")
    return o
def rings(name,rings,material,n=48):
    # Rings are counterclockwise viewed from above. Profiles can fold inward to create a bowl.
    verts=[];faces=[]
    for xx,yy,z,rx,ry in rings:
        verts.extend((xx+rx*cos(2*pi*i/n),yy+ry*sin(2*pi*i/n),z) for i in range(n))
    for k in range(len(rings)-1):
        for i in range(n):faces.append((k*n+i,k*n+(i+1)%n,(k+1)*n+(i+1)%n,(k+1)*n+i))
    faces.extend([tuple(reversed(range(n))),tuple(range((len(rings)-1)*n,len(rings)*n))])
    return mesh(name,verts,faces,material,True)
def lathe(name,profiles,material,n=48):
    return rings(name,[(0,0,z,rx,ry) for z,rx,ry in profiles],material,n)
def ell(name,p,dim,m,n=22):
    o=lathe(name,[(dim[2]*cos(pi-j*pi/14),max(.0001,dim[0]*sin(pi*j/14)),max(.0001,dim[1]*sin(pi*j/14))) for j in range(15)],m,n)
    o.location=p;return o
def tube(name,pts,r,material,bezier=False):
    data=bpy.data.curves.new(name,"CURVE");data.dimensions="3D";data.resolution_u=10;data.bevel_depth=r;data.bevel_resolution=3;data.use_fill_caps=True
    if bezier:
        sp=data.splines.new("BEZIER");sp.bezier_points.add(len(pts)-1)
        for b,p in zip(sp.bezier_points,pts):
            b.co=p;b.handle_left_type="AUTO";b.handle_right_type="AUTO"
    else:
        sp=data.splines.new("POLY");sp.points.add(len(pts)-1)
        for b,p in zip(sp.points,pts):b.co=(*p,1)
    data.materials.append(material);return ob(name,data)
def cylinder(name,p,r,h,m,n=48):
    o=lathe(name,[(-h/2,r*.98,r*.98),(-h/2+min(h*.15,.0015),r,r),(h/2-min(h*.15,.0015),r,r),(h/2,r*.98,r*.98)],m,n);o.location=p;return o
def along(name,a,b,r,m,n=32):
    v=Vector(b)-Vector(a);o=cylinder(name,(Vector(a)+Vector(b))*.5,r,v.length,m,n)
    o.rotation_euler=v.to_track_quat('Z','Y').to_euler();return o
def disk(name,p,r,depth,m):
    o=cylinder(name,p,r,depth,m,80);o.rotation_euler.x=pi/2;return o
def collection_switch(c): 
    global C
    C=c
products={}
def product(slug,c,offset,build):
    global C
    C=c;existing=set(cols[c].objects);build()
    objs=list(set(cols[c].objects)-existing)
    products[slug]=(objs,offset)
    for o in objs:o.location+=Vector(offset)
def faucet(tall=False):
    finish=black if tall else gold
    h=.43 if tall else .27
    cylinder("Escutcheon", (0,0,.009),.055,.018,finish)
    cylinder("Pedestal", (0,0,.077),.042,.138,finish)
    cylinder("Mixer joint", (0,0,.151),.043,.037,finish)
    if tall:
        tube("Bent swan neck",[(0,0,.158),(0,0,h-.09),(0,-.032,h-.016),(0,-.105,h+.014),(0,-.179,h-.008),(0,-.208,h-.07)],.019,finish,True)
        end=h-.081;y=-.208
        along("Pull-down spray head",(0,y,h-.064),(0,y,h-.128),.026,finish)
        end=h-.128
    else:
        tube("Radius spout",[(0,0,.154),(0,0,h-.038),(0,-.025,h),(0,-.11,h+.003),(0,-.147,h-.005),(0,-.168,h-.036)],.022,finish,True)
        end=h-.038;y=-.168
    cylinder("Aerator dark mesh",(0,y,end),.018,.004,dark)
    along("Mixer axle",(.03,0,.123),(.064,0,.123),.024,finish)
    along("Single control lever",(.064,0,.123),(.064,.025,.215),.008,finish)
def basin():
    lathe("Ellipse vessel | continuous ceramic shell",[(0,.238,.153),(.026,.25,.163),(.12,.315,.219),(.143,.32,.222),(.15,.315,.217),(.146,.306,.207),(.124,.299,.2),(.06,.225,.135),(.034,.132,.074),(.03,.025,.025)],ivory,80)
    cylinder("Waste pop-up",(0,0,.032),.025,.006,steel)
def toilet():
    lathe("Concealed trap pedestal",[(0,.16,.21),(.017,.169,.218),(.18,.164,.217),(.28,.19,.28),(.38,.201,.298)],ivory,60)
    o=lathe("Rounded seat and lid",[(.373,.211,.315),(.39,.215,.319),(.403,.215,.319),(.413,.198,.302)],ivory,64);o.location.y=-.024
    box("Compact cistern",(0,.205,.57),(.39,.205,.39),ivory,.065)
    box("Flush plate",(0,.205,.773),(.095,.038,.009),chrome,.009)
def shower():
    along("Riser rail",(0,0,.53),(0,0,2.12),.018,chrome)
    tube("Overhead bend",[(0,0,2.055),(0,0,2.17),(0,-.046,2.21),(0,-.27,2.21),(0,-.33,2.18),(0,-.33,2.15)],.018,chrome,True)
    cylinder("Rain rose shell",(0,-.33,2.14),.158,.023,chrome)
    cylinder("Perforated spray face",(0,-.33,2.127),.149,.005,steel)
    for k,n in [(1,8),(2,16),(3,24)]:
        for i in range(n):
            x=.042*k*cos(i*2*pi/n);y=-.33+.042*k*sin(i*2*pi/n)
            cylinder("Silicone spray jet",(x,y,2.122),.003,.007,dark,10)
    along("Thermostatic bar",(-.16,-.016,.87),(.16,-.016,.87),.042,chrome)
    for x in (-.133,.133):along("Fluted control",(x-.026,-.016,.87),(x+.026,-.016,.87),.048,chrome)
    along("Hand spray",( .14,-.09,1.27),(.18,-.07,1.52),.023,chrome)
    tube("Flexible hand shower hose",[(.12,-.02,.85),(.18,-.16,.49),(.27,-.14,.45),(.16,-.09,1.28)],.010,chrome,True)
    for z in (1.05,1.91):along("Wall bracket",(0,0,z),(0,.075,z),.031,chrome)
def sink():
    # Rectangular basin with rounded corners, rolled rim and sloped draining floor.
    vs=[];fs=[]
    for w,d,rad,z in [(.71,.46,.055,0),(.71,.46,.055,.019),(.664,.414,.052,.022),(.64,.39,.052,-.002),(.58,.33,.058,-.158),(.49,.24,.056,-.175)]:
        ring=[]
        for cx,cy,start in ((w/2-rad,d/2-rad,0),(-w/2+rad,d/2-rad,90),(-w/2+rad,-d/2+rad,180),(w/2-rad,-d/2+rad,270)):
            for i in range(9):
                a=math.radians(start+i*90/8);ring.append((cx+rad*cos(a),cy+rad*sin(a),z))
        vs.extend(ring)
    n=36
    for j in range(5):
        for i in range(n):fs.append((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i))
    fs.append(tuple(range(5*n,6*n)));mesh("Pressed steel single bowl",vs,fs,steel,True)
    cylinder("Strainer lip",(0,.052,-.170),.045,.008,chrome)
    cylinder("Strainer inset",(0,.052,-.165),.036,.006,dark)
    cylinder("Waste basket",(0,.052,-.161),.029,.007,steel)
def valve():
    along("Brass valve body",(-.118,0,.060),(.118,0,.060),.043,gold)
    for x in [-.096,.096]:
        along("Hex union",(x-.026,0,.06),(x+.026,0,.06),.054,gold,6)
    cylinder("Packing gland",(0,0,.119),.028,.06,gold,6)
    cylinder("Lever pivot",(0,0,.157),.023,.021,steel)
    box("Ball valve handle",(.079,0,.160),(.192,.035,.014),black,.009)
def accessory():
    lathe("Amber soap reservoir",[(0,.045,.045),(.008,.051,.051),(.14,.051,.051),(.15,.048,.048),(.158,.024,.024),(.17,.023,.023)],amber)
    cylinder("Pump collar",(0,0,.178),.025,.026,gold);cylinder("Pump stem",(0,0,.2),.009,.035,gold)
    box("Dispenser lever",(0,-.012,.219),(.033,.068,.015),gold,.006)
product("faucet","Faucets",(-.14,2.32,.91),lambda:faucet(False))
product("basin","Washbasins",(-.14,2.095,.91),basin)
product("toilet","Toilets",(2.24,2.06,.002),toilet)
product("shower","Shower_Systems",(-2.64,2.495,.01),shower)
product("sink","Kitchen_Sinks",(6.35,2.125,.931),sink)
product("kitchen-faucet","Faucets",(6.35,2.412,.93),lambda:faucet(True))
product("valve","Plumbing_Fittings",(10.8,2.26,1.08),valve)
product("accessory","Accessories",(.52,2.18,.913),accessory)
exec((ROOT/'blender/finish.py').read_text())
