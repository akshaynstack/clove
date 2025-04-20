import * as THREE from 'three'
import Experience from './Experience.js'
import Baked from './Baked.js'
import GoogleLeds from './GoogleLeds.js'
import LoupedeckButtons from './LoupedeckButtons.js'
import CoffeeSteam from './CoffeeSteam.js'
import TopChair from './TopChair.js'
import ElgatoLight from './ElgatoLight.js'
import BouncingLogo from './BouncingLogo.js'
import Screen from './Screen.js'
import { getYouTubeLiveVideoId } from '../../utils/youtubeLiveCheck.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setBaked()
                this.setGoogleLeds()
                this.setLoupedeckButtons()
                this.setCoffeeSteam()
                this.setTopChair()
                this.setElgatoLight()
                this.setBouncingLogo()
                this.setScreens()
            }
        })
    }

    setBaked()
    {
        this.baked = new Baked()
    }

    setGoogleLeds()
    {
        this.googleLeds = new GoogleLeds()
    }

    setLoupedeckButtons()
    {
        this.loupedeckButtons = new LoupedeckButtons()
    }

    setCoffeeSteam()
    {
        this.coffeeSteam = new CoffeeSteam()
    }

    setTopChair()
    {
        this.topChair = new TopChair()
    }

    setElgatoLight()
    {
        this.elgatoLight = new ElgatoLight()
    }

    setBouncingLogo()
    {
        this.bouncingLogo = new BouncingLogo()
    }

    // setScreens()
    // {
    //     this.pcScreen = new Screen(
    //         this.resources.items.pcScreenModel.scene.children[0],
    //         '/assets/videoPortfolio.mp4'
    //     )
    //     this.macScreen = new Screen(
    //         this.resources.items.macScreenModel.scene.children[0],
    //         '/assets/videoStream.mp4'
    //     )
    // }

    // async setScreens() {
    //     // const YOUTUBE_CHANNEL_ID = 'UCquRONGPzcqCIShW2SjuJKg';
    //     const YOUTUBE_CHANNEL_ID = 'UCSQ7hHnWkDMyDBEp-h1Pqbg';
    //     const YOUTUBE_API_KEY = 'AIzaSyBSZPvyikBXM62eMWdGc0Qtmdh7xWldmmQ';
    
    //     const liveVideoId = await getYouTubeLiveVideoId(YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY);
    
    //     // Always show portfolio on PC screen
    //     this.pcScreen = new Screen(
    //         this.resources.items.pcScreenModel.scene.children[0],
    //         '/assets/videoPortfolio.mp4'
    //     );
    
    //     if (liveVideoId) {
    //         console.log('✅ Channel is LIVE. Showing YouTube live stream.');
    //         console.log('Live video ID:', liveVideoId);
    
    //         this.macScreen = new Screen(
    //             this.resources.items.macScreenModel.scene.children[0],
    //             liveVideoId,
    //             true // isYouTube
    //         );
    //     } else {
    //         console.log('❌ Channel is NOT live. Showing fallback video.');
    //         this.macScreen = new Screen(
    //             this.resources.items.macScreenModel.scene.children[0],
    //             '/assets/videoStream.mp4'
    //         );
    //     }
    // }  
    
    async setScreens() {
        // YouTube Channel ID and API Key
        const YOUTUBE_CHANNEL_ID = 'UCSQ7hHnWkDMyDBEp-h1Pqbg';
        const YOUTUBE_API_KEY = 'AIzaSyBSZPvyikBXM62eMWdGc0Qtmdh7xWldmmQ';
    
        // Fetch live video ID
        const liveVideoId = await getYouTubeLiveVideoId(YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY);
    
        // Always show portfolio on PC screen
        this.pcScreen = new Screen(
            this.resources.items.pcScreenModel.scene.children[0],
            '/assets/videoPortfolio.mp4'
        );
    
        if (liveVideoId) {
            console.log('✅ Channel is LIVE. Showing YouTube live stream.');
            console.log('Live video ID:', liveVideoId);
    
            // Create a video element for the YouTube stream
            const video = document.createElement('video');
            video.src = `https://www.youtube.com/watch?v=${liveVideoId}`;
            video.crossOrigin = 'anonymous'; // Allow cross-origin requests
            video.loop = true;
            video.muted = true; // Make sure video plays without sound
            video.autoplay = true;
    
            // Start playing the video
            video.play();
    
            // Create a video texture for Three.js
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBFormat;
    
            // Apply the video texture to the mac screen material
            const material = new THREE.MeshBasicMaterial({ map: videoTexture });
            this.macScreen = new Screen(
                this.resources.items.macScreenModel.scene.children[0],
                material
            );
        } else {
            console.log('❌ Channel is NOT live. Showing fallback video.');
            // If not live, show fallback video
            this.macScreen = new Screen(
                this.resources.items.macScreenModel.scene.children[0],
                '/assets/videoStream.mp4'
            );
        }
    }

    

    resize()
    {
    }

    update()
    {
        if(this.googleLeds)
            this.googleLeds.update()

        if(this.loupedeckButtons)
            this.loupedeckButtons.update()

        if(this.coffeeSteam)
            this.coffeeSteam.update()

        if(this.topChair)
            this.topChair.update()

        if(this.bouncingLogo)
            this.bouncingLogo.update()
    }

    destroy()
    {
    }
}