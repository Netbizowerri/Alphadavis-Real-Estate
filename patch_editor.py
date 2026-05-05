with open(r'src\pages\admin\PropertyEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# Fix 1: Lines 341-344 - change 2-col to 3-col + add Status Tag
# Find and replace specific lines
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Detect the 2-col grid in step 1 (has "Asset Category")
    if 'Asset Category' in line and 'SelectField' in line:
        # Replace the whole block: go back to find the opening div
        # The div is at i-1
        new_lines.pop()  # remove the div line we already added
        new_lines.append('                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">')
        new_lines.append('                              <SelectField label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleInputChange} options={propertyTypes} />')
        # skip the next line (Market Listing Type)
        i += 1
        next_line = lines[i]  # Market Listing Type line - replace
        new_lines.append('                              <SelectField label="Listing Type" name="listingType" value={formData.listingType} onChange={handleInputChange} options={[{val: \'sale\', lbl: \'For Sale\'}, {val: \'rent\', lbl: \'Regular Rent\'}, {val: \'shortlet\', lbl: \'Short Let\'}]} />')
        new_lines.append('                              <InputField label="Status Tag" name="status" value={formData.status} onChange={handleInputChange} placeholder="e.g. Pre-Sale Price" />')
        i += 1
        continue

    # Fix 2: Replace Featured Asset Pick block with city + 3 checkboxes
    if 'Featured Asset Pick' in line:
        # Remove previous lines to reconstruct block
        # pop back: label, input, opening div, and the floorAreaSqm div wrapper
        new_lines.pop()  # label line
        new_lines.pop()  # input checkbox
        new_lines.pop()  # opening div (flex items-center)
        new_lines.pop()  # <InputField floorAreaSqm>
        new_lines.pop()  # <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        new_lines.append('                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">')
        new_lines.append('                            <InputField label="Area (sqm)" name="floorAreaSqm" value={formData.floorAreaSqm} onChange={handleInputChange} type="number" />')
        new_lines.append('                            <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Enugu, Lagos" />')
        new_lines.append('                        </div>')
        new_lines.append('                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">')
        new_lines.append('                            <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">')
        new_lines.append('                               <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 accent-brand-accent" />')
        new_lines.append('                               <label htmlFor="isFeatured" className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Featured</label>')
        new_lines.append('                            </div>')
        new_lines.append('                            <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">')
        new_lines.append('                               <input type="checkbox" id="isDiasporaPick" name="isDiasporaPick" checked={(formData as any).isDiasporaPick || false} onChange={handleInputChange} className="w-5 h-5 accent-brand-accent" />')
        new_lines.append('                               <label htmlFor="isDiasporaPick" className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Diaspora Pick</label>')
        new_lines.append('                            </div>')
        new_lines.append('                            <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">')
        new_lines.append('                               <input type="checkbox" id="isNewListing" name="isNewListing" checked={(formData as any).isNewListing || false} onChange={handleInputChange} className="w-5 h-5 accent-brand-accent" />')
        new_lines.append('                               <label htmlFor="isNewListing" className="text-xs font-black uppercase tracking-widest text-slate-500 italic">New Listing</label>')
        new_lines.append('                            </div>')
        new_lines.append('                        </div>')
        # skip closing div of the featured block
        i += 1  # skip </div> of the flex div
        i += 1  # skip </div> of the mt-6 grid wrapper
        i += 1
        continue

    new_lines.append(line)
    i += 1

result = '\n'.join(new_lines)

with open(r'src\pages\admin\PropertyEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(result)

print('Done!')
print('Status Tag present:', 'Status Tag' in result)
print('Diaspora Pick present:', 'Diaspora Pick' in result)
print('City field present:', 'label="City"' in result)
