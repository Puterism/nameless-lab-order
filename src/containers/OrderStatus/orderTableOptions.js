export const localization = {
  pagination: {
    labelDisplayedRows: '전체 {count}개 중 {from}-{to}',
    labelRowsSelect: '품목',
    labelRowsPerPage: '페이지당 품목',
    firstAriaLabel: '첫 페이지',
    firstTooltip: '첫 페이지',
    previousAriaLabel: '이전 페이지',
    previousTooltip: '이전 페이지',
    nextAriaLabel: '다음 페이지',
    nextTooltip: '다음 페이지',
    lastAriaLabel: '마지막 페이지',
    lastTooltip: '마지막 페이지',
  },
  toolbar: {
    addRemoveColumns: '열 추가 or 삭제',
    nRowsSelected: '{0}개의 품목 선택됨',
    showColumnsTitle: '열 표시',
    showColumnsAriaLabel: '열 표시',
    exportTitle: '내보내기',
    exportAriaLabel: '내보내기',
    exportName: 'CSV로 내보내기',
    searchTooltip: '검색',
    searchPlaceholder: '검색...',
  },
  header: {
    actions: '',
  },
  body: {
    emptyDataSourceMessage: '항목이 없습니다.',
    addTooltip: '추가',
    deleteTooltip: '삭제',
    editTooltip: '수정',
    filterRow: {
      filterPlaceHolder: '필터...',
      filterTooltip: '필터',
    },
    editRow: {
      deleteText: '이 품목을 정말로 삭제하시겠습니까?',
      cancelTooltip: '취소',
      saveTooltip: '저장',
    },
  },
  grouping: {
    placeholder: '헤더를 드래그하세요',
    groupedBy: '그룹됨: ',
  },
};

export const options = {
  exportButton: true,
  rowStyle: {
    fontSize: '1.1em',
  },
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 40, 50],
};
