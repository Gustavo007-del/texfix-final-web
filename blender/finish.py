# Executed in the same namespace as build_showroom.py.
MODELS.mkdir(parents=True,exist_ok=True); IMAGES.mkdir(parents=True,exist_ok=True)
for slug,(objs,offset) in products.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.location-=Vector(offset);o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(MODELS/(slug+'.glb')),use_selection=True,export_apply=True)
    for o in objs:o.location+=Vector(offset)
C='Home_Environment'
box('Gallery floor',(4,0,-.1),(18,7,.2),stone)
box('Limewash wall',(4,2.7,1.65),(18,.14,3.3),wall)
C='Bathroom'
box('Floating vanity',(0,2.1,.66),(2.15,.85,.44),wood)
box('Stone countertop',(0,2.1,.88),(2.2,.9,.06),stone)
disk('Mirror halo',(0,2.57,1.9),.69,.06,lamp);disk('Silver mirror',(0,2.52,1.9),.655,.04,mirror)
for i in range(20):box('Walnut flute',(1+i*.057,2.60,1.65),(.035,.08,3.3),wood)
C='Shower_Area'
box('Shower glass',(-1.65,1.73,1.09),(.026,1.55,2.18),glass)
C='Kitchen'
for i in range(6):
    x=4.15+i*.76
    box('Oak kitchen cabinet',(x,2.12,.45),(.745,.85,.86),wood)
    box('Pull',(x,1.68,.78),(.22,.035,.022),gold)
for x,w in [(4.84,2.35),(7.78,2.12)]:box('Counter slab',(x,2.12,.9),(w,.92,.06),stone)
box('Kitchen shelf',(6.35,2.4,1.75),(4.5,.4,.045),wood)
for i in range(7):cylinder('Stoneware jar',(4.6+i*.29,2.35,1.87),.08,.18,ivory)
C='Utility_Area'
for i in range(3):
    along('Supply manifold',(10+i*.42,2.36,.1),(10+i*.42,2.36,2.15),.027,copper)
    along('Feed',(10+i*.42,2.36,2.15),(11.55,2.36,2.15+i*.08),.025,copper)
exec((ROOT/'blender/service_scene.py').read_text())
C='Lighting'
def light(name,pos,power,size):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size
    o=ob(name,data);o.location=pos;o.rotation_euler=(Vector((pos[0]-1,2,1))-o.location).to_track_quat('-Z','Y').to_euler()
for x in [-2,3,8,12]:light('Courtyard softbox',(x,-2.7,4),420,4)
C='Cameras';cam=ob('Gallery camera',bpy.data.cameras.new('Architectural lens'));scene.camera=cam
def aim(pos,target):cam.location=pos;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
aim((2,-4.6,1.7),(-.7,2,1.2))
scene.render.engine='CYCLES';scene.cycles.samples=3;scene.cycles.use_denoising=True
scene.render.resolution_x=640;scene.render.resolution_y=440;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='JPEG'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'blender/TEXFIX_MASTER.blend'))
bpy.ops.export_scene.gltf(filepath=str(MODELS/'showroom.glb'),export_apply=True,export_cameras=False,export_lights=False)
for slug,(objs,off) in products.items():
    points=[o.matrix_world@Vector(p) for o in objs for p in o.bound_box]
    a=Vector([min(p[i] for p in points) for i in range(3)]);b=Vector([max(p[i] for p in points) for i in range(3)]);middle=(a+b)/2
    for o in scene.objects:
        if o.type in ['MESH','CURVE']:o.hide_render=o not in objs
    cam.data.type='ORTHO';cam.data.ortho_scale=max(b-a)*1.8;aim(middle+Vector((1,-1.8,1)),middle)
    scene.render.filepath=str(IMAGES/(slug+'.jpg'));bpy.ops.render.render(write_still=True)


