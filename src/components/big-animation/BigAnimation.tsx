import SpatialAudioSection from "./SpatialAudioSection"
// import SpatialAudioSectionVideo from "./SpatialAudioSectionVideo"

const BigAnimation = ({
  isSecondFormInView,
  adaptiveBottom,
}: {
  isSecondFormInView: boolean
  adaptiveBottom: number
}) => (
  <main>
    <div className="overflow-clip">
      <SpatialAudioSection
        isSecondFormInView={isSecondFormInView}
        adaptiveBottom={adaptiveBottom}
      />
    </div>
  </main>
)

export default BigAnimation
