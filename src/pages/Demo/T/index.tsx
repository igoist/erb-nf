import * as React from 'react';
import * as utils from '../utils';

const { useState, useEffect, useRef } = React;

const { bindFormCheck, showError, hideError } = utils;

type HBFormItemProps = {
  name: string;
  label?: string;
  placeholder?: string;
  inputType?: string;
  disabled?: boolean;
};

const HBFormItem = (props: HBFormItemProps) => {
  const pf = `hb-form-item`;
  const { name, label, inputType = 'text', placeholder, disabled = false } = props;
  const [value, setValue] = useState('');

  const elRef = useRef();

  useEffect(() => {
    const el: any = elRef.current;
    //- 具体的 blur、keyup 事件实现及绑定
    var checkCaptcha = function () {
      var ifPass = true;

      if (!el.value.match(/^\d{4}$/)) {
        ifPass = false;
        showError(el, '请输入 4 位数字验证码');
      } else {
        hideError(el);
      }

      return ifPass;
    };

    var checkCaptchaKeyUp = function () {
      if (el.value.match(/^\d{4}$/)) {
        hideError(el);
      }
    };

    bindFormCheck(el, checkCaptcha);
    bindFormCheck(el, checkCaptchaKeyUp, 'keyup');
  }, []);

  const handleOnChange = (e: any) => {
    if (e.target) {
      setValue(e.target.value);
    }
  };

  return (
    <div className={`${pf}`}>
      {label && <div className={`${pf}-label`}>{label}</div>}
      <div className={`${pf}-control`}>
        <input
          ref={elRef}
          className={`hb-input ${pf}-control-input`}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleOnChange}
        ></input>
        <div className={`${pf}-explain ${pf}-explain-error`}></div>
      </div>
    </div>
  );
};

const T = () => {
  const Items = [
    {
      name: 'name',
      label: 'label',
      placeholder: 'placeholder',
      // inputType
    },
    {
      name: 'name',
      label: 'label',
      placeholder: 'placeholder',
      // inputType
    },
  ];
  return (
    <div>
      <div>TTTTTTTTT</div>
      <div id='abcd'></div>

      {Items.map((item) => (
        <HBFormItem {...item} />
      ))}
    </div>
  );
};

export default T;
