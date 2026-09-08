interface SessionFlagsCheckboxesProps {
  preAuth: boolean;
  moto: boolean;
  tokenizationEnabled: boolean;
  includeLineItems: boolean;
  preAuthLabel: string;
  motoLabel: string;
  tokenizationLabel: string;
  klarnaBnplLabel: string;
  showIncludeLineItems: boolean;
  disabled?: boolean;
  onChange: (
    key: "preAuth" | "moto" | "tokenizationEnabled" | "includeLineItems",
    value: boolean,
  ) => void;
}

type SessionFlagKey =
  | "preAuth"
  | "moto"
  | "tokenizationEnabled"
  | "includeLineItems";

type SessionFlagLabelKey =
  | "preAuthLabel"
  | "motoLabel"
  | "tokenizationLabel"
  | "klarnaBnplLabel";

const FLAGS: { key: SessionFlagKey; labelKey: SessionFlagLabelKey }[] = [
  { key: "preAuth", labelKey: "preAuthLabel" },
  { key: "moto", labelKey: "motoLabel" },
  { key: "tokenizationEnabled", labelKey: "tokenizationLabel" },
  { key: "includeLineItems", labelKey: "klarnaBnplLabel" },
];

export function SessionFlagsCheckboxes({
  preAuth,
  moto,
  tokenizationEnabled,
  includeLineItems,
  preAuthLabel,
  motoLabel,
  tokenizationLabel,
  klarnaBnplLabel,
  showIncludeLineItems,
  disabled,
  onChange,
}: SessionFlagsCheckboxesProps) {
  const values = {
    preAuth,
    moto,
    tokenizationEnabled,
    includeLineItems,
  };
  const labels = {
    preAuthLabel,
    motoLabel,
    tokenizationLabel,
    klarnaBnplLabel,
  };
  const flags = showIncludeLineItems
    ? FLAGS
    : FLAGS.filter((flag) => flag.key !== "includeLineItems");

  return (
    <div className="pbs-dropin__field pbs-dropin__field--full">
      <div className="pbs-dropin__checkboxes" data-testid="pbs-checkboxes">
        {flags.map((flag) => (
          <label
            key={flag.key}
            className={
              values[flag.key]
                ? "pbs-dropin__checkbox pbs-dropin__checkbox--selected"
                : "pbs-dropin__checkbox"
            }
          >
            <input
              type="checkbox"
              checked={values[flag.key]}
              disabled={disabled}
              onChange={(event) => onChange(flag.key, event.target.checked)}
            />
            {labels[flag.labelKey]}
          </label>
        ))}
      </div>
    </div>
  );
}
