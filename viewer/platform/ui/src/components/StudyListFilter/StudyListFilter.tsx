import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import LegacyButton from '../LegacyButton';
import Icon from '../Icon';
import Typography from '../Typography';
import InputGroup from '../InputGroup';

const StudyListFilter = ({
  filtersMeta,
  filterValues,
  onChange,
  clearFilters,
  isFiltering,
  numOfStudies,
  onUploadClick,
  getDataSourceConfigurationComponent,
  selectedStudies,
}) => {
  console.log('selectedStudies', selectedStudies);
  const { t } = useTranslation('StudyList');

  const { sortBy, sortDirection } = filterValues;
  const filterSorting = { sortBy, sortDirection };
  const setFilterSorting = sortingValues => {
    onChange({
      ...filterValues,
      ...sortingValues,
    });
  };
  const isSortingEnabled = numOfStudies > 0 && numOfStudies <= 100;

  const handleCompareClick = () => {
    if (selectedStudies.length > 1) {
      const studyInstanceUIDs = selectedStudies.join(',');
      window.location.href = `/viewer?StudyInstanceUIDs=${studyInstanceUIDs}&hangingprotocolId=@ohif/hpCompare`;
    }
  };

  return (
    <React.Fragment>
      <div>
        <div className="bg-black">
          <div className="container relative mx-auto flex flex-col pt-5">
            <div className="mb-5 flex flex-row justify-between">
              <div className="flex min-w-[1px] shrink flex-row items-center gap-6">
                <Typography
                  variant="h6"
                  className="text-white"
                >
                  {t('StudyList')}
                </Typography>
                {getDataSourceConfigurationComponent && getDataSourceConfigurationComponent()}
                {onUploadClick && (
                  <div
                    className="text-primary-active flex cursor-pointer items-center gap-2 self-center text-lg font-semibold"
                    onClick={onUploadClick}
                  >
                    <Icon name="icon-upload"></Icon>
                    <span>{t('Upload')}</span>
                  </div>
                )}
                <LegacyButton
                  className="text-primary-active"
                  onClick={handleCompareClick}
                  disabled={selectedStudies.length <= 1}
                >
                  {t('Compare')} ({selectedStudies.length})
                </LegacyButton>
              </div>
              <div className="flex h-[34px] flex-row items-center">
                {isFiltering && (
                  <LegacyButton
                    rounded="full"
                    variant="outlined"
                    color="primaryActive"
                    border="primaryActive"
                    className="mx-8"
                    startIcon={<Icon name="cancel" />}
                    onClick={clearFilters}
                  >
                    {t('ClearFilters')}
                  </LegacyButton>
                )}
                <Typography
                  variant="h6"
                  className="text-primary-light"
                >
                  {`${t('Number of studies')}: `}
                </Typography>
                <Typography
                  variant="h6"
                  className="mr-2"
                  data-cy={'num-studies'}
                >
                  {numOfStudies > 100 ? '>100' : numOfStudies}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky -top-1 z-10 mx-auto border-b-4 border-black">
        <div className="bg-primary-dark pt-3 pb-3">
          <InputGroup
            inputMeta={filtersMeta}
            values={filterValues}
            onValuesChange={onChange}
            sorting={filterSorting}
            onSortingChange={setFilterSorting}
            isSortingEnabled={isSortingEnabled}
          />
        </div>
        {numOfStudies > 100 && (
          <div className="container m-auto">
            <div className="bg-primary-main rounded-b py-1 text-center text-base">
              <p className="text-white">{t('Filter list to 100 studies or less to enable sorting')}</p>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

StudyListFilter.propTypes = {
  filtersMeta: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  isFiltering: PropTypes.bool.isRequired,
  numOfStudies: PropTypes.number.isRequired,
  onUploadClick: PropTypes.func,
  getDataSourceConfigurationComponent: PropTypes.func,
  selectedStudies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default StudyListFilter;
