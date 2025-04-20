import * as THREE from 'three'
import { Pane } from 'tweakpane'

import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import Stats from './Utils/Stats.js'

import Resources from './Resources.js'
import Renderer from './Renderer.js'
import Camera from './Camera.js'
import World from './World.js'
import Navigation from './Navigation.js'

import assets from './assets.js'

import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default class Experience {
    static instance

    constructor(_options = {}) {
        if (Experience.instance) {
            return Experience.instance
        }
        Experience.instance = this

        // Options
        this.targetElement = _options.targetElement

        if (!this.targetElement) {
            console.warn('Missing \'targetElement\' property')
            return
        }

        this.time = new Time()
        this.sizes = new Sizes()
        this.setConfig()
        this.setStats()
        this.setDebug()
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.setCSSRenderer() // ⬅️ Added
        this.setResources()
        this.setWorld()
        this.setNavigation()

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.update()
    }

    setConfig() {
        this.config = {}

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
        this.config.smallestSide = Math.min(this.config.width, this.config.height)
        this.config.largestSide = Math.max(this.config.width, this.config.height)

        // Debug
        this.config.debug = this.config.width > 420
    }

    setStats() {
        if (this.config.debug) {
            this.stats = new Stats(true)
        }
    }

    setDebug() {
        if (this.config.debug) {
            this.debug = new Pane()
            this.debug.containerElem_.style.width = '320px'
        }
    }

    setScene() {
        this.scene = new THREE.Scene()
    }

    setCamera() {
        this.camera = new Camera()
    }

    setRenderer() {
        this.renderer = new Renderer({ rendererInstance: this.rendererInstance })
        this.targetElement.appendChild(this.renderer.instance.domElement)
    }

    setCSSRenderer() {
        // ✅ CSS3D Renderer setup
        this.cssRenderer = new CSS3DRenderer()
        this.cssRenderer.setSize(this.config.width, this.config.height)
        this.cssRenderer.domElement.style.position = 'absolute'
        this.cssRenderer.domElement.style.top = '0'
        this.cssRenderer.domElement.style.left = '0'
        this.targetElement.appendChild(this.cssRenderer.domElement)
    }

    setResources() {
        this.resources = new Resources(assets)
    }

    setWorld() {
        this.world = new World()
    }

    setNavigation() {
        this.navigation = new Navigation()
    }

    update() {
        if (this.stats)
            this.stats.update()

        this.camera.update()

        if (this.renderer)
            this.renderer.update()

        if (this.world)
            this.world.update()

        if (this.navigation)
            this.navigation.update()

        // 🔁 Render CSS3D
        if (this.cssRenderer && this.camera.instance)
            this.cssRenderer.render(this.scene, this.camera.instance)

        window.requestAnimationFrame(() => {
            this.update()
        })
    }

    resize() {
        // Config
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height
        this.config.smallestSide = Math.min(this.config.width, this.config.height)
        this.config.largestSide = Math.max(this.config.width, this.config.height)

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        if (this.camera)
            this.camera.resize()

        if (this.renderer)
            this.renderer.resize()

        if (this.cssRenderer)
            this.cssRenderer.setSize(this.config.width, this.config.height)

        if (this.world)
            this.world.resize()
    }

    destroy() {
        // Optional: clean up objects, listeners, etc.
    }
}