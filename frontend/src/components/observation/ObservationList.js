import React from 'react'
import { connect } from 'react-redux'
import { setMarkers } from '../../reducers/markerReducer'
import Observation from './Observation'
import ReactPaginate from 'react-paginate'
import observationService from '../../services/observations'

class ObservationList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      offset: 1,
      observations: [],
      loaded: false,
      limit: 10
    }
  }

  componentWillMount() {
    this.loadObservations()
    this.props.setMarkers()
  }

  loadObservations = async () => {
    let observations = []
    if (this.props.observations.length < 1) {
      console.log('db')
      observations = await observationService.getAll()
    } else {
      observations = this.props.observations
    }
    const filteredObservations = observations.slice(this.state.offset, this.state.offset+this.state.limit)
    this.setState({ observations: filteredObservations, pageCount: Math.ceil(observations.length / this.state.limit)})
  }

  handlePageClick = (data) => {
    const selected = data.selected
    const offset = Math.ceil(selected * this.state.limit)
    this.setState({ offset }, () => {
      this.loadObservations()
    })
  }

  render() {

    const paginateStyle = {
      backgroundColor: "#373737",
      marginBottom: '10px'
    }

    return (
      <div>
        <h1>Kaikki havainnot</h1>
        <div style={paginateStyle} className="observationList">
        <ReactPaginate previousLabel={"Edellinen"}
                        nextLabel={"Seuraava"}
                        breakLabel={<a href="">...</a>}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
        </div>
        { this.state.observations.map(observation => <Observation key={observation.id} observation={observation} />) }
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    observations: state.observations
  }
}

export default connect (
  mapStateToProps,
  { setMarkers }
) (ObservationList)