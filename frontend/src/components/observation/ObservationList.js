import React from 'react'
import { connect } from 'react-redux'
import Observation from './Observation'
import ReactPaginate from 'react-paginate'
import observationService from '../../services/observations'

class ObservationList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      offset: 1,
      observations: [],
      loaded: false
    }
  }

  componentWillMount() {
    this.loadObservations()
  }

  loadObservations = async () => {
    let observations = []
    if (this.props.observations.length < 1) {
      observations = await observationService.getAll()
    } else {
      observations = this.props.observations
    }

    const filteredObservations = observations.slice(this.state.offset, this.state.offset+5)

    this.setState({ observations: filteredObservations, pageCount: Math.ceil(observations.length / 5)})
  }

  handlePageClick = (data) => {
    const selected = data.selected
    const offset = Math.ceil(selected * 5)
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
        <div style={paginateStyle}>
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
  null
) (ObservationList)