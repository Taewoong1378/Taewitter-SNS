import { useState, useCallback } from "react";

// 커스텀 훅 제작
export default (initialValue = null) => {
    const [value, setvalue] = useState(initialValue);
    const handler = useCallback((e) => {
        setvalue(e.target.value);
    },[]);
    return [value, handler];
}