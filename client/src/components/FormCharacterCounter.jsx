const counterBaseStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '8px',
  minHeight: '18px',
  marginTop: '4px',
  fontSize: '12px',
  lineHeight: 1.2,
};

const FormCharacterCounter = ({ value = '', max, className = '', style = {} }) => {
  if (!max) return null;

  const count = String(value || '').length;
  const isAtLimit = count >= max;

  return (
    <div
      className={className}
      style={{
        ...counterBaseStyle,
        color: isAtLimit ? '#ff9fb7' : 'rgba(174, 184, 199, 0.82)',
        ...style,
      }}
      aria-live="polite"
    >
      {isAtLimit && <span>Limite alcanzado</span>}
      <span>{count}/{max}</span>
    </div>
  );
};

export default FormCharacterCounter;
