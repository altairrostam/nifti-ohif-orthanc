import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import getGridWidthClass from '../../utils/getGridWidthClass';

import Icon from '../Icon';

const StudyListTableRow = props => {
  const { tableData } = props;
  const { 
    row, 
    expandedContent, 
    onClickRow, 
    isExpanded, 
    dataCY, 
    clickableCY,
    isSelected,
    onSelectStudy,
    studyInstanceUID
  } = tableData;

  const handleCheckboxChange = (event) => {
    event.stopPropagation();
    onSelectStudy(studyInstanceUID);
  };

  return (
    <tr
      className="select-none"
      data-cy={dataCY}
    >
      <td
        className={classnames('border-0 p-0', {
          'border-secondary-light bg-primary-dark border-b': isExpanded,
        })}
      >
        <div
          className={classnames(
            'w-full transition duration-300',
            {
              'border-primary-light hover:border-secondary-light mb-2 overflow-visible rounded border':
                isExpanded,
            },
            {
              'border-transparent': !isExpanded,
            }
          )}
        >
          <table className={classnames('w-full p-4')}>
            <tbody>
              <tr
                className={classnames(
                  'hover:bg-secondary-main cursor-pointer transition duration-300',
                  {
                    'bg-primary-dark': !isExpanded,
                  },
                  { 'bg-secondary-dark': isExpanded }
                )}
                onClick={onClickRow}
                data-cy={clickableCY}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                {row.map((cell, index) => {
                  const { content, title, gridCol } = cell;
                  return (
                    <td
                      key={index}
                      className={classnames(
                        'truncate px-4 py-2 text-base',
                        { 'border-secondary-light border-b': !isExpanded },
                        getGridWidthClass(gridCol) || ''
                      )}
                      style={{
                        maxWidth: 0,
                      }}
                      title={title}
                    >
                      <div className="flex">
                        {index === 0 && (
                          <div>
                            <Icon
                              name={isExpanded ? 'chevron-down' : 'chevron-right'}
                              className="mr-4 inline-flex"
                            />
                          </div>
                        )}
                        <div
                          className={classnames({ 'overflow-hidden': true }, { truncate: true })}
                        >
                          {content}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
              {isExpanded && (
                <tr className="max-h-0 w-full select-text overflow-hidden bg-black">
                  <td colSpan={row.length + 1}>{expandedContent}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
};

StudyListTableRow.propTypes = {
  tableData: PropTypes.shape({
    row: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        content: PropTypes.node,
        title: PropTypes.string,
        gridCol: PropTypes.number.isRequired,
      })
    ).isRequired,
    expandedContent: PropTypes.node.isRequired,
    onClickRow: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    dataCY: PropTypes.string,
    clickableCY: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
    onSelectStudy: PropTypes.func.isRequired,
    studyInstanceUID: PropTypes.string.isRequired,
  }),
};

export default StudyListTableRow;