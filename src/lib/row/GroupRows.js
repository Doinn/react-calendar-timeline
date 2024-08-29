import PropTypes from 'prop-types'
import React, { Component } from 'react'

import GroupRow from './GroupRow'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'

const passThroughPropTypes = {
    canvasWidth: PropTypes.number.isRequired,
    lineCount: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    onRowClick: PropTypes.func.isRequired,
    onRowDoubleClick: PropTypes.func.isRequired,
    clickTolerance: PropTypes.number.isRequired,
    groups: PropTypes.array.isRequired,
    horizontalLineClassNamesForGroup: PropTypes.func,
    horizontalLineClassNamesForGroupCell: PropTypes.func,
    onRowContextClick: PropTypes.func.isRequired,
    canvasTimeStart: PropTypes.number.isRequired,
    canvasTimeEnd: PropTypes.number.isRequired,
    minUnit: PropTypes.string.isRequired,
    timeSteps: PropTypes.object.isRequired,
    groupIdCells: PropTypes.array
  }

class GroupRows extends Component {
  static propTypes = {
    ...passThroughPropTypes,
    getLeftOffsetFromDate: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.lineCount === this.props.lineCount &&
      nextProps.groupHeights === this.props.groupHeights &&
      nextProps.groups === this.props.groups &&
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.minUnit === this.props.minUnit &&
      nextProps.timeSteps === this.props.timeSteps &&
      nextProps.groupIdCells === this.props.groupIdCells
    )
  }

  render() {
    const {
      canvasWidth,
      lineCount,
      groupHeights,
      onRowClick,
      onRowDoubleClick,
      clickTolerance,
      groups,
      horizontalLineClassNamesForGroup,
      horizontalLineClassNamesForGroupCell,
      onRowContextClick,
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      getLeftOffsetFromDate,
      groupIdCells
    } = this.props
    let lines = []

    for (let i = 0; i < lineCount; i++) {
      lines.push(
        <GroupRow
          clickTolerance={clickTolerance}
          onContextMenu={evt => onRowContextClick(evt, i)}
          onClick={evt => onRowClick(evt, i)}
          onDoubleClick={evt => onRowDoubleClick(evt, i)}
          key={`horizontal-line-${i}`}
          isEvenRow={i % 2 === 0}
          group={groups[i]}
          horizontalLineClassNamesForGroup={horizontalLineClassNamesForGroup}
          horizontalLineClassNamesForGroupCell={horizontalLineClassNamesForGroupCell}
          style={{
            width: `${canvasWidth}px`,
            height: `${groupHeights[i]}px`,
            position: 'relative'
          }}
          canvasTimeStart={canvasTimeStart}
          canvasTimeEnd={canvasTimeEnd}
          timeSteps={timeSteps}
          minUnit={minUnit}
          getLeftOffsetFromDate={getLeftOffsetFromDate}
          groupIdCells={groupIdCells}
        />
      )
    }

    return <div className="rct-horizontal-lines">{lines}</div>
  }
}

const GroupRowsWrapper = ({ ...props }) => {
  return (
    <TimelineStateConsumer>
      {({ getLeftOffsetFromDate }) => (
        <GroupRows getLeftOffsetFromDate={getLeftOffsetFromDate} {...props} />
      )}
    </TimelineStateConsumer>
  )
}

GroupRowsWrapper.defaultProps = {
  ...passThroughPropTypes
}

export default GroupRowsWrapper
