import React from 'react'
import FormHeader from './header'
import Formbody from './form';

const Form = ({ title, subtitle, fields, handleSubmit, isSubmitDisabled, redirectTxt, redirectAnchor, redirectLink, ctaText }) => {
    return (
        <>
            <FormHeader {...{ title, subtitle }} />
            <Formbody {...{ fields, handleSubmit, isSubmitDisabled, ctaText }} />
        </>
    )
}

export default Form