import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { _get, arraysEqual } from '../utility/generic'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'

class Sidebar extends Component {
  static propTypes = {
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool,
    visibleRowFirst: PropTypes.number,
    visibleRowLast: PropTypes.number,
    groupTopsPrefixSum: PropTypes.array
  }

  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.groupHeights, this.props.groupHeights) &&
      nextProps.visibleRowFirst === this.props.visibleRowFirst &&
      nextProps.visibleRowLast === this.props.visibleRowLast
    )
  }

  renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey) {
    if (this.props.groupRenderer) {
      return React.createElement(this.props.groupRenderer, {
        group,
        isRightSidebar
      })
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey)
    }
  }

  render() {
    const {
      width,
      groupHeights,
      height,
      isRightSidebar,
      visibleRowFirst,
      visibleRowLast,
      groupTopsPrefixSum
    } = this.props

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = this.props.keys

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`
    }

    const groupsStyle = {
      width: `${width}px`
    }

    const total = this.props.groups.length
    const useVirtualization =
      visibleRowFirst !== undefined &&
      visibleRowFirst >= 0 &&
      visibleRowLast >= visibleRowFirst &&
      groupTopsPrefixSum &&
      groupTopsPrefixSum.length > 1

    const first = useVirtualization ? visibleRowFirst : 0
    const last = useVirtualization
      ? Math.min(visibleRowLast, total - 1)
      : total - 1
    const topSpacer = useVirtualization ? groupTopsPrefixSum[first] || 0 : 0
    const totalHeightPx = useVirtualization
      ? groupTopsPrefixSum[total] || 0
      : 0
    const bottomSpacer = useVirtualization
      ? Math.max(0, totalHeightPx - (groupTopsPrefixSum[last + 1] || 0))
      : 0

    const groupLines = []
    if (topSpacer > 0) {
      groupLines.push(
        <div key="rct-sidebar-top-spacer" style={{ height: `${topSpacer}px` }} />
      )
    }
    for (let i = first; i <= last; i++) {
      const group = this.props.groups[i]
      const elementStyle = {
        height: `${groupHeights[i]}px`,
        lineHeight: `${groupHeights[i]}px`
      }
      groupLines.push(
        <div
          key={_get(group, groupIdKey)}
          className={
            'rct-sidebar-row rct-sidebar-row-' + (i % 2 === 0 ? 'even' : 'odd')
          }
          style={elementStyle}
        >
          {this.renderGroupContent(
            group,
            isRightSidebar,
            groupTitleKey,
            groupRightTitleKey
          )}
        </div>
      )
    }
    if (bottomSpacer > 0) {
      groupLines.push(
        <div
          key="rct-sidebar-bottom-spacer"
          style={{ height: `${bottomSpacer}px` }}
        />
      )
    }

    return (
      <div
        className={'rct-sidebar' + (isRightSidebar ? ' rct-sidebar-right' : '')}
        style={sidebarStyle}
      >
        <div style={groupsStyle}>{groupLines}</div>
      </div>
    )
  }
}

const SidebarWrapper = props => (
  <TimelineStateConsumer>
    {({ visibleRowFirst, visibleRowLast, groupTopsPrefixSum }) => (
      <Sidebar
        visibleRowFirst={visibleRowFirst}
        visibleRowLast={visibleRowLast}
        groupTopsPrefixSum={groupTopsPrefixSum}
        {...props}
      />
    )}
  </TimelineStateConsumer>
)

export { Sidebar as RawSidebar }
export default SidebarWrapper
