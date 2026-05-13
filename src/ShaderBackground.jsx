import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

export default function ShaderBackground() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <ShaderGradientCanvas
        pixelDensity={1.2}
        fov={45}
        lazyLoad={false}
      >
        <ShaderGradient
          animate="on"
          axesHelper="on"
          brightness={1.2}
          cAzimuthAngle={180}
          cDistance={3.93}
          cPolarAngle={93}
          cameraZoom={1}
          color1="#ffb8f9"
          color2="#b9feb2"
          color3="#9aa5dc"
          destination="onCanvas"
          embedMode="off"
          envPreset="lobby"
          format="gif"
          fov={45}
          frameRate={10}
          gizmoHelper="hide"
          grain="off"
          lightType="3d"
          pixelDensity={1.4}
          positionX={-0.5}
          positionY={0.1}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={0}
          rotationY={0}
          rotationZ={235}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.3}
          uFrequency={5.5}
          uSpeed={0.2}
          uStrength={2.5}
          uTime={0.2}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  )
}
