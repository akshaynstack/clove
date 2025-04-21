import * as THREE from 'three'
import Experience from './Experience.js'

export default class CloveModel {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.time = this.experience.time
        this.renderer = this.experience.renderer

        this.setLights()
        this.setModel()
    }

    setLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 10, 7.5)

        this.scene.add(ambientLight)
        this.scene.add(directionalLight)

        // Ensure correct texture encoding
        if (this.renderer) {
            this.renderer.outputEncoding = THREE.sRGBEncoding
        }
    }

    setModel() {
        this.model = {}
        this.model.group = this.resources.items.cloveModel.scene.children[0]

        // Adjust model scale and position
        this.model.group.scale.set(2.3, 2.3, 2.3)
    this.model.group.position.set(-2.6, -0.3, 2)
    this.model.group.rotation.set(0, Math.PI / 2, 0) // face left


        this.scene.add(this.model.group)

        // Optional: force materials to update encoding
        this.model.group.traverse((_child) => {
            if (_child instanceof THREE.Mesh && _child.material) {
                _child.material.side = THREE.DoubleSide
                if (_child.material.map) {
                    _child.material.map.encoding = THREE.sRGBEncoding
                }
                _child.material.needsUpdate = true
            }
        })
    }

    update() {
        // if (this.model.group) {
        //     this.model.group.rotation.y = Math.sin(this.time.elapsed * 0.0005) * 0.5
        // }
    }
}