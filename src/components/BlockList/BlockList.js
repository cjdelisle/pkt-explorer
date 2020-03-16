import React from 'react'
import TimeAgo from 'javascript-time-ago'
import {
  canonical
} from 'javascript-time-ago/gradation'
import styled from 'styled-components'
import { mqs } from '../../theme/metrics'
import PropTypes from 'prop-types'
import {
  ListLabel,
  ListLabelCont,
  ListCont
} from '../CommonComps/CommonComps'
import { Link } from 'react-router-dom'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import Loader, { LoaderWrapper } from '../Loader/Loader'

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en)
// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US')

const agoOpts = { gradation: canonical }

const BlockListLabel = styled(ListLabel)`
  :nth-child(2) {
    /* justify-content: center; */
  }
`

class AgeCell extends React.Component {
  render() {
    const { time } = this.props
    const dt = (new Date(time)).getTime()
    const cDate = (new Date()).getTime()
    const diff = cDate - dt
  
    const humanInterval = timeAgo.format(cDate - diff, agoOpts)
  
    return (<span title={(new Date(time)).toString()}>
      {humanInterval.toString()}
    </span>)
  }
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 30000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
}

export const BlockListLabels = ({ cells }) => <ListLabelCont>{
  Object.keys(cells).map((header) => <BlockListLabel key={header}>{header}</BlockListLabel>)
}</ListLabelCont>

const BlockTable = styled.table`
  width: 100%;
  padding:0;
  margin:0;
  tr {
    padding: 0 1rem;
  }
  tr:nth-child(2n) {
    background-color: ${({ theme }) => theme.colors.pktGreyLight};
  }
  th {
    text-transform: capitalize;
    padding: 1rem;
  }
  td {
    padding: .5rem 1rem;
  }

  border: none;
  border-collapse: inherit;
  border-spacing: 0;
  border-color: inherit;
  vertical-align: inherit;
  font-weight: inherit;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;

  td:last-child,
  th:last-child{
    text-align: right
  }

`

const TrTh = styled.th`
  &:after {
    content: "Transactions";
    @media ${mqs.small} {
      content: "Tx";
    }
  }
`
const BlockList = ({ listData, home }) => {
  return (
    listData
      ? <ListCont>
        {home && <ListLabelCont>Last Blocks</ListLabelCont>}
        <BlockTable>
          <thead>
            <tr>
              <th scope="col">height</th>
              <th scope="col">age</th>
              <TrTh scope="col"/>
              <th scope="col">size</th>
            </tr>
          </thead>
          <tbody>
            {listData.map((blk) => <tr key={`tr-${blk.height}`}>
              <td><Link to={`/block/${blk.hash}`}>{blk.height}</Link></td>
              <td><AgeCell time={blk.time} /></td>
              <td>{blk.transactionCount}</td>
              <td>{blk.size}</td>
            </tr>)}
          </tbody>
        </BlockTable>
      </ListCont>
      : <LoaderWrapper><Loader /></LoaderWrapper>
  )
}

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  /* align-content: space-between;  */
  justify-content: space-between;
  padding: 0.5rem 1rem ;
  :nth-child(2n + 1) {
    background-color: ${({ theme }) => theme.colors.pktGreyLight};
  }
`

const NewRow = ({ blk }) => <Row>
  <Link to={`/block/${blk.hash}`}>{blk.height}</Link>
  <AgeCell time={blk.time} />
  <div>{blk.transactionCount}</div>
  <div>{blk.size}</div>
</Row>

BlockList.propTypes = {
  listData: PropTypes.array,
  home: PropTypes.bool
}

NewRow.propTypes = {
  blk: PropTypes.shape({
    hash: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    transactionCount: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
  }).isRequired
}

AgeCell.propTypes = {
  time: PropTypes.string.isRequired
}

BlockListLabels.propTypes = {
  cells: PropTypes.PropTypes.shape({
    height: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    transactions: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired
  }).isRequired
}

BlockList.defaultProps = {}

export default BlockList
