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
    canvasTimeStart: PropTypes.number,
    canvasTimeEnd: PropTypes.number,
    minUnit: PropTypes.string,
    timeSteps: PropTypes.object,
    groupIdCells: PropTypes.array
  }

class GroupRows extends Component {
  static propTypes = {
    ...passThroughPropTypes,
    getLeftOffsetFromDate: PropTypes.func,
    visibleRowFirst: PropTypes.number,
    visibleRowLast: PropTypes.number,
    groupTopsPrefixSum: PropTypes.array
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
      nextProps.groupIdCells === this.props.groupIdCells &&
      nextProps.visibleRowFirst === this.props.visibleRowFirst &&
      nextProps.visibleRowLast === this.props.visibleRowLast
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
      groupIdCells,
      visibleRowFirst,
      visibleRowLast,
      groupTopsPrefixSum
    } = this.props

    const useVirtualization =
      visibleRowFirst !== undefined &&
      visibleRowFirst >= 0 &&
      visibleRowLast >= visibleRowFirst &&
      groupTopsPrefixSum &&
      groupTopsPrefixSum.length > 1

    const first = useVirtualization ? visibleRowFirst : 0
    const last = useVirtualization
      ? Math.min(visibleRowLast, lineCount - 1)
      : lineCount - 1
    const topSpacerHeight = useVirtualization
      ? groupTopsPrefixSum[first] || 0
      : 0
    const totalHeight = useVirtualization
      ? groupTopsPrefixSum[lineCount] || 0
      : 0
    const bottomSpacerHeight = useVirtualization
      ? Math.max(0, totalHeight - (groupTopsPrefixSum[last + 1] || 0))
      : 0

    const lines = []
    if (topSpacerHeight > 0) {
      lines.push(
        <div
          key="rct-virtual-top-spacer"
          style={{ height: `${topSpacerHeight}px`, width: `${canvasWidth}px` }}
        />
      )
    }

    for (let i = first; i <= last; i++) {
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

    if (bottomSpacerHeight > 0) {
      lines.push(
        <div
          key="rct-virtual-bottom-spacer"
          style={{ height: `${bottomSpacerHeight}px`, width: `${canvasWidth}px` }}
        />
      )
    }

    return <div className="rct-horizontal-lines">{lines}</div>
  }
}

const GroupRowsWrapper = ({ ...props }) => {
  return (
    <TimelineStateConsumer>
      {({
        getLeftOffsetFromDate,
        visibleRowFirst,
        visibleRowLast,
        groupTopsPrefixSum
      }) => (
        <GroupRows
          getLeftOffsetFromDate={getLeftOffsetFromDate}
          visibleRowFirst={visibleRowFirst}
          visibleRowLast={visibleRowLast}
          groupTopsPrefixSum={groupTopsPrefixSum}
          {...props}
        />
      )}
    </TimelineStateConsumer>
  )
}

GroupRowsWrapper.propTypes = passThroughPropTypes

export default GroupRowsWrapper
