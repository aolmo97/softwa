"use client";
import { filterIds, type FilterId } from "@/lib/model";
import { filterLabels } from "@/lib/discovery";
import { track } from "./analytics";
export function FilterPanel({
  selected,
  onChange,
}: {
  selected: FilterId[];
  onChange: (next: FilterId[]) => void;
}) {
  return (
    <fieldset className="filter-panel">
      <legend>Filter alternatives</legend>
      <p className="small muted">Only verified matches are included.</p>
      {filterIds.map((id) => (
        <label className="checkbox" key={id}>
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={(e) => {
              track("filter_used", { filter: id, enabled: e.target.checked });
              onChange(
                e.target.checked
                  ? [...selected, id]
                  : selected.filter((f) => f !== id),
              );
            }}
          />
          {filterLabels[id]}
        </label>
      ))}
      {selected.length > 0 && (
        <button className="text-button" onClick={() => onChange([])}>
          Clear all filters
        </button>
      )}
    </fieldset>
  );
}
