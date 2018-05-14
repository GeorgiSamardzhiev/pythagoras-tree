var levelOfRecursion = prompt("Level of the tree(between 1 and 16)?");
var fill = confirm('Fill the triangles?');
var depth = 0.1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 1, 13);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var geometry = new THREE.BoxGeometry(1, 1, depth);

var material = new THREE.MeshPhongMaterial({ color: 'green' });
var cubef = new THREE.Mesh(geometry, material);
cubef.position.y--;
var tree = new THREE.Geometry();
var filling = new THREE.Geometry();

cubef.updateMatrix();
tree.merge(cubef.geometry, cubef.matrix)

function buildTree(cube, level, normal) {
    if (level >= levelOfRecursion) {
        return;
    }
    var normall = new THREE.Vector3(normal.x, normal.y, normal.z);
    var normalr = new THREE.Vector3(normal.x, normal.y, normal.z);
    var geometry = new THREE.BoxGeometry(cube.geometry.parameters.width / Math.sqrt(2), cube.geometry.parameters.height / Math.sqrt(2), depth);

    if (fill) {
        var triangle = new THREE.Mesh(geometry, material);
        triangle.position.x = cube.position.x;
        triangle.position.y = cube.position.y;
        triangle.position.z = cube.position.z;
        triangle.translateOnAxis(normal, cube.geometry.parameters.width / 2);
        triangle.rotation.z = level * Math.PI / 4;
        triangle.updateMatrix();
        filling.merge(triangle.geometry, triangle.matrix);
    }

    cube1 = new THREE.Mesh(geometry, material);
    cube1.position.x = cube.position.x;
    cube1.position.y = cube.position.y;
    cube1.position.z = cube.position.z;

    var cube2 = new THREE.Mesh(geometry, material);
    cube2.position.x = cube.position.x;
    cube2.position.y = cube.position.y;
    cube2.position.z = cube.position.z;

    cube1.translateOnAxis(normall, cube.geometry.parameters.width);
    cube1.translateOnAxis(new THREE.Vector3(-normall.y, normall.x, 0),
                                                cube1.geometry.parameters.width / (Math.sqrt(2)));
    cube1.rotation.z = level * (Math.PI / 4)

    normall.x = Math.sqrt(2) / 2 * (normal.x - normal.y);
    normall.y = Math.sqrt(2) / 2 * (normal.x + normal.y);
    cube1.updateMatrix();
    tree.merge(cube1.geometry, cube1.matrix);
    buildTree(cube1, level + 1, normall);

    cube2.translateOnAxis(normalr, cube.geometry.parameters.width);
    cube2.translateOnAxis(new THREE.Vector3(normalr.y, -normalr.x, 0),
                                          cube2.geometry.parameters.width / Math.sqrt(2));
    cube2.rotation.z = -(level * (Math.PI / 4));

    normalr.x = Math.sqrt(2) / 2 * (normal.x + normal.y);
    normalr.y = Math.sqrt(2) / 2 * (normal.y - normal.x);
    cube2.updateMatrix();
    tree.merge(cube2.geometry, cube2.matrix);
    buildTree(cube2, level + 1, normalr);
}

buildTree(cubef, 1, new THREE.Vector3(0, 1, 0));

var pythagorasTree = new THREE.Mesh(tree, material);
scene.add(pythagorasTree);

if (fill) {
    var triangles = new THREE.Mesh(filling, material);
    scene.add(triangles);
}
var light = new THREE.PointLight();
light.position.set(3, 3, 8);
scene.add(light);

function drawFrame() {
    requestAnimationFrame(drawFrame);
    pythagorasTree.rotation.y += 0.005;
    if (fill) {
        triangles.rotation.y += 0.005
    }
    renderer.render(scene, camera);

}

if (confirm('Do you want to rotate it?')) {
    drawFrame();
} else {
    renderer.render(scene, camera);
}