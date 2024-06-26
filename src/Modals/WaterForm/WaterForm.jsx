import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import css from './WaterForm.module.css';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  addConsumption,
  updateConsumption,
} from '../../redux/water/operations.js';
import { useDispatch, useSelector } from 'react-redux';
import { selectChosenDate } from '../../redux/water/selectors';
import { useTranslation } from 'react-i18next';

const schema = Yup.object().shape({
  waterAmount: Yup.number()
    .typeError('Water amount must be a number')
    .required('Water amount is required')
    .positive('Water amount must be positive')
    .max(99999, 'Water amount cannot exceed 5 digits'),
  time: Yup.string()
    .required('Time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)')
    .test(
      'is-not-future-time',
      'Record time cannot be in the future',
      function (value) {
        const currentTime = new Date();
        const [hours, minutes] = value.split(':');
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);
        return selectedTime <= currentTime;
      }
    ),
});

const WaterForm = ({ isClose, defaultValues, operationType }) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const dispatch = useDispatch();
  const date = useSelector(selectChosenDate);

  const [waterAmount, setWaterAmount] = useState(defaultValues.amount || 250);
  const [time, setTime] = useState('');

  useEffect(() => {
    setValue(
      'waterAmount',
      waterAmount === '' ? '' : parseInt(waterAmount, 10)
    );
    setValue('time', time);
  }, [waterAmount, time, setValue]);

  useEffect(() => {
    const currentTime = new Date();
    const formattedTime =
      defaultValues.time ||
      `${String(currentTime.getHours()).padStart(2, '0')}:${String(
        currentTime.getMinutes()
      ).padStart(2, '0')}`;

    setTime(formattedTime);
  }, [defaultValues.time]);

  const handleIncrement = () => {
    setWaterAmount(prevAmount => {
      const incrementedAmount = parseInt(prevAmount, 10) + 50;
      return Math.min(incrementedAmount, 99999);
    });
  };

  const handleDecrement = () => {
    setWaterAmount(prevAmount => Math.max(0, parseInt(prevAmount, 10) - 50));
  };

  const handleInputChange = event => {
    const { value } = event.target;

    if (value === '' || /^\d{1,5}$/.test(value)) {
      setWaterAmount(value);
    }
  };

  const handleTimeChange = event => {
    const selectedTime = event.target.value;
    const currentTime = new Date();
    const [hours, minutes] = selectedTime.split(':');
    const selectedDateTime = new Date();
    selectedDateTime.setHours(hours, minutes, 0, 0);
    if (selectedDateTime <= currentTime) {
      setTime(selectedTime);
    } else {
      alert('Time cannot be in the future');
    }
  };

  const onSubmit = async data => {
    const postData = {
      date: date,
      time: data.time,
      amount: data.waterAmount,
    };

    if (operationType === 'edit') {
      await dispatch(
        updateConsumption({ _id: defaultValues._id, ...postData })
      );
    } else {
      await dispatch(addConsumption(postData));
    }

    isClose();
  };

  return (
    <form className={css.waterForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={css.inputGroup}>
        <label htmlFor="waterAmount" className={css.inputParagraph}>
          {t('modals.waterAmount')}
        </label>
        <div className={css.buttonsContainer}>
          <button
            type="button"
            onClick={handleDecrement}
            className={css.buttonIncrement}
          >
            -
          </button>
          <span className={css.waterAmount}>{waterAmount} ml </span>
          <button
            type="button"
            onClick={handleIncrement}
            className={css.buttonIncrement}
          >
            +
          </button>
        </div>
        <div className={css.divError}>
          {errors.waterAmount && <p>{errors.waterAmount.message}</p>}
        </div>
      </div>
      <div className={css.inputGroup}>
        <label htmlFor="time" className={css.labelWater}>
          {t('modals.recordingTime')}
        </label>
        <input
          type="time"
          name="time"
          className={css.waterInput}
          onChange={handleTimeChange}
          {...register('time')}
        />
        <div className={css.divError}>
          {errors.time && <p>{errors.time.message}</p>}
        </div>
      </div>
      <div className={css.inputGroupWater}>
        <label htmlFor="waterAmount" className={css.labelWater}>
          {t('modals.enterWater')}
        </label>
        <input
          type="text"
          className={css.waterInput}
          onChange={handleInputChange}
          value={waterAmount === 0 ? '0' : waterAmount}
          min="0"
          maxLength="5"
        />
      </div>
      <div>
        <button type="submit" className={css.saveBtn}>
          {t('modals.saveBtn')}
        </button>
      </div>
    </form>
  );
};

export default WaterForm;
