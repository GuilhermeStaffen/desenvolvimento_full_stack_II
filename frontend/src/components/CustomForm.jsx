import React, { useState, useEffect } from "react";

export default function CustomForm({ current, onSave, onCancel, fields }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (current) setFormData(current);
    else setFormData({});
  }, [current]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({});
  };

  const renderField = (field) => {
    const { name, type, options, placeholder } = field;
    const value = formData[name] ?? (type === "checkbox" ? false : "");

    switch (type) {
      case "text":
      case "number":
      case "date":
        return (
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder || ""}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        );

      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            rows="4"
            placeholder={placeholder || ""}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        );

      case "array":
        return (
          <div>
            {(value || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 mb-2 border border-gray-200 rounded-lg p-2"
              >
                <input
                  type="text"
                  value={item.url || ""}
                  placeholder={`Item ${idx + 1}`}
                  onChange={(e) => {
                    const updated = [...value];
                    updated[idx] = { ...updated[idx], url: e.target.value };
                    handleChange(name, updated);
                  }}
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = value.filter((_, i) => i !== idx);
                    handleChange(name, updated);
                  }}
                  className="text-red-600 font-bold hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleChange(name, [...(value || []), { url: "" }])}
              className="text-sm text-blue-600 font-semibold mt-1 hover:text-blue-800"
            >
              + Adicionar item
            </button>
          </div>
        );

      case "select":
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Selecione...</option>
            {options?.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(name, e.target.checked)}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
            />
            <span className="text-gray-700">{placeholder || name}</span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => (
        <div
          key={field.name}
          className={`flex flex-col ${field.type === "checkbox" ? "mt-2" : ""}`}
        >
          {field.type !== "checkbox" && (
            <label
              htmlFor={field.name}
              className="font-medium text-gray-700 mb-1 capitalize"
            >
              {field.label || field.name.replace("_", " ")}
            </label>
          )}
          {renderField(field)}
        </div>
      ))}

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-sea text-white hover:bg-sea-500 font-semibold transition"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
