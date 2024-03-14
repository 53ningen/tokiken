interface Props {
  id: string
}

const IndexHeading = ({ id }: Props) => {
  return id === '' ? (
    <></>
  ) : (
    <div className="relative">
      <div className="py-4 text-left text-primary font-semibold">{id}</div>
      <div id={id} className="absolute -top-12" />
    </div>
  )
}

export default IndexHeading
