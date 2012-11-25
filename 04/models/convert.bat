:: Automatic script to run three.js converter
echo @off

Set ThreeJsRoot="C:/Users/Bajtek/Documents/GitHub/OpenMOBA/libs/threejs"
Set Name=%1
Set Name=%Name:~0,-4%
:: echo 'Name : '%Name%

python %ThreeJsRoot%/utils/exporters/obj/convert_obj_three.py -i %Name%.obj -o %Name%.json

:: pause