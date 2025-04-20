import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

import Experience from './Experience.js'

export default class Screen {
    constructor(_mesh, _sourcePath, _isYouTube = false) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.world = this.experience.world

        this.mesh = _mesh
        this.sourcePath = _sourcePath
        this.isYouTube = _isYouTube

        this.setModel()
    }

    setModel() {
        if (this.isYouTube) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${this.sourcePath}?autoplay=1&mute=1&controls=0&playsinline=1`;
            iframe.style.border = '0';
            iframe.allow = 'autoplay; encrypted-media';
            iframe.width = '1280';
            iframe.height = '720';
        
            const cssObject = new CSS3DObject(iframe);
        
            // ✅ Position and rotation fix
            const quaternion = new THREE.Quaternion();
            this.mesh.getWorldQuaternion(quaternion);
            const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');
        
            cssObject.position.copy(this.mesh.getWorldPosition(new THREE.Vector3()));
            cssObject.rotation.copy(euler);
            cssObject.scale.set(1, 1, 1); // Adjust if needed
        
            this.scene.add(cssObject);
            this.model = { element: iframe, object: cssObject };
        } else {
            // --- Standard Local Video Texture ---
            this.model = {}

            // Video Element
            this.model.element = document.createElement('video')
            this.model.element.muted = true
            this.model.element.loop = true
            this.model.element.controls = true
            this.model.element.playsInline = true
            this.model.element.autoplay = true
            this.model.element.src = this.sourcePath
            this.model.element.play()

            // Texture
            this.model.texture = new THREE.VideoTexture(this.model.element)
            this.model.texture.encoding = THREE.sRGBEncoding

            // Material
            this.model.material = new THREE.MeshBasicMaterial({
                map: this.model.texture
            })

            // Assign material to mesh
            this.model.mesh = this.mesh
            this.model.mesh.material = this.model.material
            this.scene.add(this.model.mesh)
        }
    }

    update() {
        // No need to update unless you want dynamic behavior
    }
}