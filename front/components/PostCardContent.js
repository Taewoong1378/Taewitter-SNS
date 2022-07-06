import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const PostCardContent = ({
  postData,
  editMode,
  onCancelRevisePost,
  onRevisePost,
}) => {
  const [editText, setEditText] = useState(postData);
  const onReviseText = useCallback((e) => {
    setEditText(e.target.value);
  });
  const revisePostLoading = useSelector(
    (state) => state.post.revisePostLoading,
  );

  return (
    // 첫 번째 게시글 #해시태그 #해시태그
    <div>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onReviseText} />
          <Button.Group>
            <Button
              loading={revisePostLoading}
              onClick={onRevisePost(editText)}>
              수정
            </Button>
            <Button type='danger' onClick={onCancelRevisePost}>
              취소
            </Button>
          </Button.Group>
        </>
      ) : (
        postData.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/)) {
            // eslint-disable-next-line react/no-array-index-key
            return (
              <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}>
                <a>{v}</a>
              </Link>
            );
          }
          return v;
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onCancelRevisePost: PropTypes.func.isRequired,
  onRevisePost: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
