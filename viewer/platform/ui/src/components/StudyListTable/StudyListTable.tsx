import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import StudyListTableRow from './StudyListTableRow';

const StudyListTable = ({ tableDataSource, querying, onStudiesSelected }) => {
  const [selectedStudies, setSelectedStudies] = useState([]);

  const handleStudySelection = (studyInstanceUID) => {
    setSelectedStudies(prevSelected => {
      const newSelected = prevSelected.includes(studyInstanceUID)
        ? prevSelected.filter(uid => uid !== studyInstanceUID)
        : [...prevSelected, studyInstanceUID];
      
      onStudiesSelected(newSelected);
      return newSelected;
    });
  };

  useEffect(() => {
    console.log('tableDataSource', tableDataSource);
    console.log('selectedStudies', selectedStudies);
  }, [selectedStudies]);

  return (
    <div className="bg-black">
      <div className="container relative m-auto">
        <table className="w-full text-white">
          <tbody
            data-cy="study-list-results"
            data-querying={querying}
          >
            {tableDataSource.map((tableData, i) => {
              const studyInstanceUID = tableData.clickableCY;
              return (
                <StudyListTableRow
                  tableData={{
                    ...tableData,
                    isSelected: selectedStudies.includes(studyInstanceUID),
                    onSelectStudy: handleStudySelection,
                    studyInstanceUID: studyInstanceUID,
                  }}
                  key={studyInstanceUID}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

StudyListTable.propTypes = {
  tableDataSource: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.array.isRequired,
      expandedContent: PropTypes.node.isRequired,
      querying: PropTypes.bool,
      onClickRow: PropTypes.func.isRequired,
      isExpanded: PropTypes.bool.isRequired,
      clickableCY: PropTypes.string.isRequired,
      dataCY: PropTypes.string.isRequired,
    })
  ),
};

export default StudyListTable;
