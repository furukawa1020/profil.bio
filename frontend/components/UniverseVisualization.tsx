'use client'

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface Planet {
  name: string
  language: string
  color: number
  position: [number, number, number]
  articles: number
  mesh?: THREE.Mesh
  orbit?: THREE.Group
}

interface Article {
  id: string
  title: string
  planet: string
  position: [number, number, number]
  mesh?: THREE.Mesh
}

export default function UniverseVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isVRMode, setIsVRMode] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Three.js setup with WebXR support
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000011, 0.8)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // WebXR サポート
    if ('xr' in navigator) {
      renderer.xr.enabled = true
      // VRボタンの設定は後で追加
    }
    
    mountRef.current.appendChild(renderer.domElement)

    // 環境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    // 方向光（太陽）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 100, 100)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // 星空背景
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 3000
    const positions = new Float32Array(starsCount * 3)
    const colors = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount * 3; i += 3) {
      // 球状に配置
      const radius = 800
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
      
      // 星の色をランダムに
      const starColor = new THREE.Color()
      starColor.setHSL(Math.random(), 0.5, 0.8)
      colors[i] = starColor.r
      colors[i + 1] = starColor.g
      colors[i + 2] = starColor.b
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const starsMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // 言語惑星の定義
    const planets: Planet[] = [
      { name: 'Go Planet', language: 'Go', color: 0x00ADD8, position: [80, 0, 0], articles: 12 },
      { name: 'Rust World', language: 'Rust', color: 0xDE3F24, position: [-80, 50, 0], articles: 8 },
      { name: 'Python Sphere', language: 'Python', color: 0x3776AB, position: [0, -80, 60], articles: 15 },
      { name: 'JavaScript Galaxy', language: 'JavaScript', color: 0xF7DF1E, position: [-60, 0, -80], articles: 20 },
      { name: 'Haskell Haven', language: 'Haskell', color: 0x5D4F85, position: [60, 80, 40], articles: 5 },
      { name: 'Philosophy Core', language: 'Philosophy', color: 0x9C27B0, position: [0, 0, 0], articles: 30 }
    ]

    const planetMeshes: THREE.Mesh[] = []
    const articleMeshes: Article[] = []

    // 惑星とその軌道を作成
    planets.forEach((planet, index) => {
      // 軌道グループ
      const orbitGroup = new THREE.Group()
      scene.add(orbitGroup)
      planet.orbit = orbitGroup

      // 惑星のジオメトリ
      const planetRadius = 8 + planet.articles * 0.3
      const geometry = new THREE.SphereGeometry(planetRadius, 32, 32)
      
      // 惑星のマテリアル（発光効果付き）
      const material = new THREE.MeshPhongMaterial({ 
        color: planet.color,
        transparent: true,
        opacity: 0.9,
        emissive: planet.color,
        emissiveIntensity: 0.2
      })
      
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...planet.position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = { type: 'planet', data: planet }
      
      orbitGroup.add(mesh)
      planetMeshes.push(mesh)
      planet.mesh = mesh

      // 惑星の周りに輝きを追加
      const glowGeometry = new THREE.SphereGeometry(planetRadius * 1.2, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: planet.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(mesh.position)
      orbitGroup.add(glow)

      // 軌道リングを表示
      if (planet.language !== 'Philosophy') {
        const orbitRadius = Math.sqrt(
          planet.position[0] ** 2 + 
          planet.position[1] ** 2 + 
          planet.position[2] ** 2
        )
        
        const orbitGeometry = new THREE.RingGeometry(orbitRadius - 1, orbitRadius + 1, 64)
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: planet.color,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide
        })
        const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial)
        orbitRing.rotation.x = Math.PI / 2
        scene.add(orbitRing)
      }

      // 惑星の周りに記事（衛星）を配置
      for (let i = 0; i < planet.articles; i++) {
        const satelliteRadius = planetRadius + 15 + Math.random() * 20
        const angle = (i / planet.articles) * Math.PI * 2
        const height = (Math.random() - 0.5) * 20
        
        const satelliteGeometry = new THREE.SphereGeometry(2, 16, 16)
        const satelliteMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: planet.color,
          emissiveIntensity: 0.5
        })
        
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
        satellite.position.set(
          planet.position[0] + Math.cos(angle) * satelliteRadius,
          planet.position[1] + height,
          planet.position[2] + Math.sin(angle) * satelliteRadius
        )
        satellite.userData = { 
          type: 'article', 
          planet: planet.language,
          orbitAngle: angle,
          orbitRadius: satelliteRadius,
          orbitSpeed: 0.01 + Math.random() * 0.02
        }
        
        orbitGroup.add(satellite)
        
        articleMeshes.push({
          id: `${planet.language}-article-${i}`,
          title: `${planet.language} Article ${i + 1}`,
          planet: planet.language,
          position: [satellite.position.x, satellite.position.y, satellite.position.z],
          mesh: satellite
        })
      }
    })

    // カメラ初期位置
    camera.position.set(150, 100, 150)
    camera.lookAt(0, 0, 0)

    // レイキャスターでクリック検出
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(planetMeshes)

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object
        const planetData = selectedObject.userData.data as Planet
        
        if (planetData) {
          setSelectedPlanet(planetData.language)
          
          // 惑星にズーム
          const targetPosition = selectedObject.position.clone()
          targetPosition.multiplyScalar(1.5)
          
          // スムーズなカメラ移動
          const startPosition = camera.position.clone()
          let progress = 0
          
          const animateCamera = () => {
            progress += 0.02
            if (progress <= 1) {
              camera.position.lerpVectors(startPosition, targetPosition, progress)
              camera.lookAt(selectedObject.position)
              requestAnimationFrame(animateCamera)
            }
          }
          animateCamera()
        }
      }
    }

    // イベントリスナー
    renderer.domElement.addEventListener('click', onMouseClick)

    // アニメーションループ
    const clock = new THREE.Clock()
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      
      // 星空をゆっくり回転
      stars.rotation.y = elapsedTime * 0.0002
      
      // 惑星の自転
      planetMeshes.forEach((planet, index) => {
        planet.rotation.y = elapsedTime * (0.01 + index * 0.002)
        
        // 軌道運動（Philosophy Core以外）
        if (planet.userData.data?.language !== 'Philosophy') {
          const orbitSpeed = 0.0005 + index * 0.0002
          const orbitRadius = Math.sqrt(
            planet.userData.data.position[0] ** 2 + 
            planet.userData.data.position[2] ** 2
          )
          
          planet.position.x = Math.cos(elapsedTime * orbitSpeed) * orbitRadius
          planet.position.z = Math.sin(elapsedTime * orbitSpeed) * orbitRadius
        }
      })
      
      // 記事衛星の軌道運動
      articleMeshes.forEach(article => {
        if (article.mesh && article.mesh.userData.type === 'article') {
          const userData = article.mesh.userData
          userData.orbitAngle += userData.orbitSpeed
          
          const parentPlanet = planets.find(p => p.language === userData.planet)
          if (parentPlanet && parentPlanet.mesh) {
            article.mesh.position.x = parentPlanet.mesh.position.x + 
              Math.cos(userData.orbitAngle) * userData.orbitRadius
            article.mesh.position.z = parentPlanet.mesh.position.z + 
              Math.sin(userData.orbitAngle) * userData.orbitRadius
          }
        }
      })

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // リサイズ対応
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', onMouseClick)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* UI オーバーレイ */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="text-lg font-bold mb-2">🌌 Philosophy Universe</h3>
          <p className="text-sm text-gray-300 mb-2">
            惑星をクリックして探索しよう
          </p>
          
          {selectedPlanet && (
            <div className="mt-2 p-2 bg-blue-500/30 rounded">
              <p className="text-sm">選択中: {selectedPlanet}</p>
            </div>
          )}
        </div>
      </div>

      {/* VRモード切替ボタン */}
      {'xr' in navigator && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsVRMode(!isVRMode)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🥽 {isVRMode ? 'VR終了' : 'VRモード'}
          </button>
        </div>
      )}

      {/* 惑星情報パネル */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white text-center">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Go</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Rust</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Python</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>JavaScript</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span>Haskell</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span>Philosophy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
