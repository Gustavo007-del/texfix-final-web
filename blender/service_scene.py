# A technician kneeling at the exposed water supply.
C='Technician_Environment'
def ellipsoid(name,center,scale,material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=18,ring_count=12,location=center)
    o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(material)
    for group in list(o.users_collection):group.objects.unlink(o)
    cols[C].objects.link(o)
    for face in o.data.polygons:face.use_smooth=True
ellipsoid('Work shirt',(10.36,1.79,.88),(.21,.14,.31),shirt)
ellipsoid('Head',(10.38,1.84,1.33),(.117,.108,.15),skin)
ellipsoid('Hair',(10.38,1.82,1.40),(.12,.11,.09),dark)
along('Neck',(10.37,1.81,1.1),(10.38,1.83,1.27),.065,skin)
for side in [-1,1]:
    x=10.36+side*.16
    knee=(x,1.93 if side==1 else 1.6,.30)
    along('Work trousers',(x,1.78,.66),knee,.104,cloth)
    along('Lower leg',knee,(x,1.40,.13),.078,cloth)
    ellipsoid('Work boot',(x,1.44,.09),(.092,.17,.08),dark)
    elbow=(x+side*.07,1.98,.89)
    along('Rolled sleeve',(x,1.8,1.06),elbow,.077,shirt)
    hand=(10.76 if side==1 else 10.65,2.18,1.08+side*.045)
    along('Forearm',elbow,hand,.049,skin)
    ellipsoid('Hand',hand,(.049,.062,.047),skin)
along('Wrench handle',(10.64,2.15,.95),(10.82,2.20,1.15),.016,steel)
box('Tool case',(9.98,1.56,.12),(.39,.23,.23),cloth)
box('Tool case latch',(9.98,1.44,.16),(.06,.012,.035),steel)
C='Utility_Area'

