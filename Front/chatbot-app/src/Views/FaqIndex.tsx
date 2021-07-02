import React, { useState } from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
    padding:20px;
    span.page-title{
        color: #EA7600;
        font-size: 30px;
        padding-bottom:10px;
    };
    .intent-flex-wrapper {
        margin-top:20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    };
    .intent-form{
        margin-top:20px;
        margin-left:20px;
    };
    .intent-table {
        flex: 1;
        width: 50%;
        margin-top:20px;
        margin-left:200px;
    };
    .user-form{
        margin-top:20px;
        margin-left:20px;
        span{
            font-size:30px;
            font-weight:bold;
        }
    };
    .form-row {
        margin-bottom: 10px;
        margin-top:10px;
        span{
            font-weight:bold;
        };
        label{
            font-weight:bold;
        };
    };
    .form-error {
        color: red;
        font-size: 14px;
        line-height: 26px;
    }
`
const StyledForm = styled.div`
    color: #394049;
    background-color: #D9D9D9;
    margin-top: 8px;
    margin-left: 12px;
    margin-right: 12px;
    border-radius: 10px;
`
function FaqIndex() {
    return (
        <StyledDiv>
            <span className="page-title">Preguntas Frecuentes</span>
            <StyledForm></StyledForm>
        </StyledDiv>
    )
}

export default FaqIndex;