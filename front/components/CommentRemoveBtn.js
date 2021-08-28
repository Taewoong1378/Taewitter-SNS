import React from 'react';
import PropTypes from 'prop-types';

const CommentRemoveBtn = ({ onRemoveComment }) => (
    <span style={{ fontSize: '13px' }} onClick={onRemoveComment}>
        삭제하기
    </span>
);

CommentRemoveBtn.propTypes = {
    onRemoveComment: PropTypes.func.isRequired,
};

export default CommentRemoveBtn;
