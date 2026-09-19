import re
import os

role_selection_path = r'c:\Users\sarvesh\Downloads\SIHDEMO\SIH\src\components\public\RoleSelectionPage.tsx'
signup_path = r'c:\Users\sarvesh\Downloads\SIHDEMO\SIH\src\components\auth\SignUpPage.tsx'

with open(role_selection_path, 'r', encoding='utf-8') as f:
    role_content = f.read()

with open(signup_path, 'r', encoding='utf-8') as f:
    signup_content = f.read()

# Extract FOUR_ROLES
four_roles_match = re.search(r'(interface RoleCardData \{.*?\nconst FOUR_ROLES: RoleCardData\[\] = \[.*?\n\];)', role_content, re.DOTALL)
if four_roles_match:
    four_roles_code = four_roles_match.group(1)
else:
    print('Could not find FOUR_ROLES')
    exit(1)

# Extract background UI
bg_ui_match = re.search(r'(      \{/\* ========================================================================= \*/\}\n      \{/\* 1\. TOP HEADER.*?\{/\* 5\. ROLE LOGIN / SIGNUP MODAL / DRAWER \(INTERACTIVE AUTH\) \*/\})', role_content, re.DOTALL)
if bg_ui_match:
    bg_ui_code = bg_ui_match.group(1)
else:
    print('Could not find background UI')
    exit(1)

# Fix bg_ui_code:
bg_ui_code = bg_ui_code.replace('selectedRole.id === cit.id', 'selectedRole_id === cit.id')
bg_ui_code = bg_ui_code.replace('selectedRole.id === uni.id', 'selectedRole_id === uni.id')
bg_ui_code = bg_ui_code.replace('selectedRole.id === ind.id', 'selectedRole_id === ind.id')
bg_ui_code = bg_ui_code.replace('selectedRole.id === gov.id', 'selectedRole_id === gov.id')
bg_ui_code = bg_ui_code.replace('selectedRole.title', 'selectedRoleTitle')
bg_ui_code = bg_ui_code.replace('handleSelectRole(cit)', 'null')
bg_ui_code = bg_ui_code.replace('handleSelectRole(uni)', 'null')
bg_ui_code = bg_ui_code.replace('handleSelectRole(ind)', 'null')
bg_ui_code = bg_ui_code.replace('handleSelectRole(gov)', 'null')
bg_ui_code = bg_ui_code.replace('handleSelectRole(roleItem)', 'null')
bg_ui_code = bg_ui_code.replace('selectedRole.id === roleItem.id', 'selectedRole_id === roleItem.id')
bg_ui_code = bg_ui_code.replace('onClick={handleContinue}', 'onClick={onNavigateToRoleSelection ? onNavigateToRoleSelection : () => setCurrentView(\'role-selection\')}')

insert_idx = signup_content.find('interface SignUpPageProps')
if insert_idx != -1:
    signup_content = signup_content[:insert_idx] + four_roles_code + '\n\n' + signup_content[insert_idx:]

if 'JharkhandEmblem' not in signup_content:
    signup_content = signup_content.replace('import { JHARKHAND_DISTRICTS } from \'../../mock/data\';', 'import { JHARKHAND_DISTRICTS } from \'../../mock/data\';\nimport { JharkhandEmblem } from \'../common/JharkhandEmblem\';')
if 'ArrowLeft' not in signup_content:
    signup_content = signup_content.replace('ArrowRight,', 'ArrowRight,\n  ArrowLeft,\n  HelpCircle,\n  Landmark,')

mapping_code = """
  const selectedRoleMatch = FOUR_ROLES.find(r => r.role === effectiveRole) || FOUR_ROLES[0];
  const selectedRole_id = selectedRoleMatch.id;
  const selectedRoleTitle = selectedRoleMatch.title;
"""
signup_content = signup_content.replace('  const effectiveRole = initialRole || currentRole || \'citizen\';', '  const effectiveRole = initialRole || currentRole || \'citizen\';' + mapping_code)

signup_content = signup_content.replace('flex flex-col justify-center overflow-hidden', 'flex flex-col justify-between overflow-hidden')

insert_ui_idx = signup_content.find('      {/* Dark Overlay (like the Auth modal) */}')
if insert_ui_idx != -1:
    signup_content = signup_content[:insert_ui_idx] + bg_ui_code + '\n' + signup_content[insert_ui_idx:]

overlay_str = '      {/* Dark Overlay (like the Auth modal) */}\n      <div className="absolute inset-0 z-10 bg-slate-950/70 backdrop-blur-xs"></div>\n\n      {/* Main Registration Card Container */}\n      <div className={`relative z-20 w-full mx-auto px-4 sm:px-0 animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-center max-h-full ${roleConfig.role === \'citizen\' ? \'max-w-[540px]\' : \'max-w-2xl\'}`}>'
new_overlay_str = '      {/* Dark Overlay (like the Auth modal) */}\n      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">\n\n      {/* Main Registration Card Container */}\n      <div className={`relative z-20 w-full mx-auto animate-in zoom-in-95 duration-200 flex flex-col justify-center max-h-full ${roleConfig.role === \'citizen\' ? \'max-w-[540px]\' : \'max-w-2xl\'}`}>'

signup_content = signup_content.replace(overlay_str, new_overlay_str)

signup_content = signup_content.replace('    </div>\n  );\n', '      </div>\n    </div>\n  );\n')

output_path = r'c:\Users\sarvesh\Downloads\SIHDEMO\SIH\scratch\new_signup.tsx'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(signup_content)
print('Done!')
