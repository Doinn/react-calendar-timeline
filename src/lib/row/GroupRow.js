import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { iterateTimes } from '../utility/calendar'
import PreventClickOnDrag from '../interaction/PreventClickOnDrag'

class GroupRow extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    onContextMenu: PropTypes.func.isRequired,
    isEvenRow: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    clickTolerance: PropTypes.number.isRequired,
    group: PropTypes.object.isRequired,
    horizontalLineClassNamesForGroup: PropTypes.func,
    horizontalLineClassNamesForGroupCell: PropTypes.func,
    canvasTimeStart: PropTypes.number.isRequired,
    canvasTimeEnd: PropTypes.number.isRequired,
    minUnit: PropTypes.string.isRequired,
    timeSteps: PropTypes.object.isRequired,
    getLeftOffsetFromDate: PropTypes.func.isRequired,
    groupIdCells: PropTypes.array
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      onContextMenu,
      onDoubleClick,
      isEvenRow,
      style,
      onClick,
      clickTolerance,
      horizontalLineClassNamesForGroup,
      horizontalLineClassNamesForGroupCell,
      group,
      getLeftOffsetFromDate,
      groupIdCells
    } = this.props
    let cells = []
    let classNamesForGroup = [];

    if (horizontalLineClassNamesForGroup) {
      classNamesForGroup = horizontalLineClassNamesForGroup(group);
    }

    if (groupIdCells.includes(group.id)) (
      iterateTimes(
        canvasTimeStart,
        canvasTimeEnd,
        minUnit,
        timeSteps,
        (time, nextTime) => {
          const left = getLeftOffsetFromDate(time.valueOf())
          const right = getLeftOffsetFromDate(nextTime.valueOf())
          const width = right - left

          let classNamesForGroupCell = [];

          if (horizontalLineClassNamesForGroupCell) {
            classNamesForGroupCell = horizontalLineClassNamesForGroupCell(group, time);
          }

          cells.push(
            <div
              key={`line-${time.valueOf()}`}
              className={`line-${time.valueOf()} ` + (classNamesForGroupCell ? classNamesForGroupCell.join(' ') : '')}
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                top: '1px',
                left: `calc(${left}px + 1px)`,
                width: `calc(${width}px - 1px)`,
                height: `calc(${style.height} - 1px)`,
              }}
            />
          )
        }
      )
    )

    return (
      <PreventClickOnDrag clickTolerance={clickTolerance} onClick={onClick}>
        <div
          onContextMenu={onContextMenu}
          onDoubleClick={onDoubleClick}
          className={(isEvenRow ? 'rct-hl-even ' : 'rct-hl-odd ') + (classNamesForGroup ? classNamesForGroup.join(' ') : '')}
          style={style}
        >
          {cells}
        </div>
      </PreventClickOnDrag>
    )
  }
}

export default GroupRow
