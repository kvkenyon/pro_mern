'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// ----------------------
// Server-side validation
// ----------------------
const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true
};

const issueFieldType = {
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required'
};

function validateIssue(issue) {
  const keys = Object.keys(issueFieldType);
  for (let i = 0; i < keys.length; i += 1) {
    const field = keys[i];
    const type = issueFieldType[field];
    if (!type) {
      delete issue[field];
    } else if (type === 'required' && !issue[field]) {
      return `${field} is required.`;
    }
  }

  if (!validIssueStatus[issue.status]) {
    return `${issue.status} is not a valid status.`;
  }

  return null;
}

exports.default = {
  validateIssue: validateIssue
};
//# sourceMappingURL=issue.js.map