# DepFlow - Enterprise Dependency Management Platform
## Complete User Manual

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Interface Overview](#user-interface-overview)
3. [Authentication](#authentication)
4. [Dashboard Navigation](#dashboard-navigation)
5. [Managing Dependencies](#managing-dependencies)
6. [Search and Filtering](#search-and-filtering)
7. [Email Notifications](#email-notifications)
8. [User Roles and Permissions](#user-roles-and-permissions)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Frequently Asked Questions](#frequently-asked-questions)

---

## Getting Started

### What is DepFlow?

**DepFlow** is an Enterprise Dependency Management Platform designed to help organizations track, manage, and monitor software dependencies across their development lifecycle. The platform provides:

- **Centralized Dependency Tracking**: Manage all your project dependencies in one place
- **Team Collaboration**: Assign dependencies to specific teams and track progress
- **Real-time Notifications**: Get email alerts when dependencies are assigned or updated
- **Advanced Filtering**: Quickly find dependencies using powerful search and filter tools
- **Status Monitoring**: Track dependency status from "Not Started" to "Completed"
- **Priority Management**: Set and track dependency priorities and risk levels

### System Requirements

- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection**: Required for email notifications and updates
- **Screen Resolution**: Minimum 1024x768 (Recommended: 1920x1080)
- **JavaScript**: Must be enabled in your browser

---

## User Interface Overview

### Landing Page

When you first visit DepFlow, you'll see the landing page featuring:

- **DepFlow Logo**: Professional branding with network dependency visualization
- **Welcome Message**: "Streamlined Software Lifecycle Management"
- **Key Features**: Overview of platform capabilities
- **Login Button**: Access to the secure application dashboard
- **Get Started Button**: Quick access to begin using the platform

### Main Dashboard

After logging in, the dashboard provides:

- **Header Navigation**: DepFlow logo, platform title, and user profile
- **Left Sidebar**: Quick overview counters and statistics
- **Main Content Area**: Dependency table and management tools
- **Filter Panel**: Search and filtering options
- **User Panel**: Profile information and logout option

---

## Authentication

### Logging In

1. **Access the Application**
   - Navigate to the DepFlow application URL
   - Click the **"Login"** button on the landing page

2. **Enter Credentials**
   - **Username**: Your assigned email address
   - **Password**: Your secure password
   - Click **"Login"** to authenticate

3. **Quick Admin Access** (Development/Demo)
   - Click **"Fill Admin Credentials"** for quick demo access
   - This pre-fills admin credentials for testing purposes

### User Types

**Administrator Users**:
- Full access to all dependencies
- Can create, edit, and delete any dependency
- Access to all team data
- User management capabilities

**Regular Users**:
- Can create new dependencies
- Can edit dependencies they created
- View-only access to dependencies created by others
- Full search and filtering capabilities

### Logging Out

- Click your **user profile** in the top-right corner
- Select **"Logout"** to securely end your session
- You'll be redirected to the landing page

---

## Dashboard Navigation

### Header Section

The header contains:
- **DepFlow Logo**: Click to return to dashboard home
- **Platform Title**: "DepFlow - Enterprise Dependency Management"
- **Status Badges**: SOC 2 Compliant, SSL Secured, 99.9% Uptime
- **User Profile**: Your name, role, and logout option

### Left Sidebar - Overview Counters

The sidebar displays real-time counters for:

- **Total Dependencies**: Complete count of all dependencies
- **In Progress**: Dependencies currently being worked on
- **Blocked**: Dependencies that are stuck or waiting
- **Completed**: Successfully finished dependencies
- **Not Started**: Dependencies waiting to begin

**💡 Pro Tip**: Click any counter to filter the main table by that status!

### Main Content Area

The central workspace includes:
- **DepFlow Dashboard Header**: Shows you're in the main dashboard
- **Add New Dependency Button**: Create new dependencies
- **Search and Filter Panel**: Tools to find specific dependencies
- **Dependencies Table**: Complete list of all dependencies with actions

---

## Managing Dependencies

### Creating a New Dependency

1. **Click "Add New Dependency"**
   - Located in the top-right of the main content area
   - Opens the dependency creation modal

2. **Fill Required Information**:

   **Basic Information**:
   - **Dependency Name*** (Required): Clear, descriptive name
   - **Description*** (Required): Detailed explanation (minimum 10 characters)
   - **Responsible Team*** (Required): Select from available teams

   **Status and Priority**:
   - **Status**: NOT STARTED, IN PROGRESS, BLOCKED, COMPLETED
   - **Priority**: HIGH, MEDIUM, LOW
   - **Risk Level**: HIGH, MEDIUM, LOW

   **Additional Information**:
   - **JIRA Ticket** (Optional): Link to related JIRA issue

3. **Save the Dependency**
   - Click **"Save"** to create the dependency
   - Click **"Cancel"** to discard changes
   - Success notification will confirm creation

### Editing Existing Dependencies

1. **Locate the Dependency**
   - Use search or scrolling to find the dependency
   - Look for the **"✏️ Edit"** button in the Actions column

2. **Make Changes**
   - Modify any field as needed
   - **Note**: You can only edit dependencies you created (unless you're an admin)

3. **Save Changes**
   - Click **"Save"** to apply updates
   - Email notifications will be sent if the team assignment changes

### Deleting Dependencies

1. **Find the Dependency**
   - Locate the dependency in the table
   - Look for the **"🗑️ Delete"** button in the Actions column

2. **Confirm Deletion**
   - Click the delete button
   - Confirm the action in the popup dialog
   - **Note**: Only creators and admins can delete dependencies

### Inline Status Updates

You can quickly update dependency status directly from the table:
- Click the **Status dropdown** in any row
- Select the new status
- Changes are saved automatically
- Counters update immediately

### Inline Priority Updates

Similarly, update priorities quickly:
- Click the **Priority dropdown** in any row
- Select the new priority level
- Changes are automatically saved

---

## Search and Filtering

### Text Search

**Search Box Features**:
- **Location**: Top of the search and filter panel
- **Search Scope**: Searches both dependency names and descriptions
- **Real-time Results**: Updates as you type
- **Case Insensitive**: Finds matches regardless of capitalization

**Search Tips**:
- Use partial words: "React" finds "React Component Library"
- Search descriptions: "API" finds all API-related dependencies
- Clear search: Delete text to show all dependencies

### Team Filtering

**Filter by Team**:
- **Dropdown Location**: Next to search box
- **Available Teams**:
  - Quality flow
  - Annotation tools
  - Data Collection
  - ADAP Platform
  - CrowdGen
  - Mercury
  - Marketing Cloud
  - Data Engineering
  - Analytics
  - Product Management

**Usage**:
- Select "All Teams" to show everything
- Choose specific team to filter results
- Combines with other filters

### Status Filtering

**Filter by Status**:
- **Options**: All Status, Not Started, In Progress, Blocked, Completed
- **Usage**: Select status to show only matching dependencies
- **Counter Integration**: Click sidebar counters for quick status filtering

### Priority Filtering

**Filter by Priority**:
- **Options**: All Priority, High, Medium, Low
- **Usage**: Focus on high-priority items or specific priority levels

### Combined Filtering

**Advanced Filtering**:
- **Multiple Filters**: Use search + team + status + priority simultaneously
- **Real-time Updates**: Results update as you add/remove filters
- **Clear All**: Use "Clear" button to reset all filters at once

### Counter-Based Filtering

**Interactive Counters**:
- **Click Total**: Show all dependencies
- **Click In Progress**: Show only in-progress items
- **Click Blocked**: Show only blocked dependencies
- **Click Completed**: Show only completed items
- **Click Not Started**: Show only items not yet started

**Toggle Behavior**:
- Click once to apply filter
- Click again to clear filter
- Active filters are visually highlighted

---

## Email Notifications

### When Emails Are Sent

**New Dependency Assignment**:
- Email sent when a new dependency is assigned to a team
- Recipient: Team owner (configured in system)
- Subject: "Dependency Assigned: [Dependency Name]"

**Team Reassignment**:
- Email sent when dependency is moved to a different team
- Recipient: New team owner
- Subject: "Dependency Reassigned: [Dependency Name]"

### Email Content

**Professional Format**:
- **Header**: DepFlow branding
- **Dependency Details**: Name, description, team, status, priority, risk level
- **JIRA Link**: If provided
- **Timestamp**: When the assignment occurred
- **Footer**: Automated notification disclaimer

### Team Owner Configuration

Current team owner mappings (contact your administrator to update):
- **Quality flow** → mmahipal.reddy@gmail.com
- **Annotation tools** → mmahipal.reddy@gmail.com
- **Data Collection** → mmahipal.reddy@gmail.com
- **ADAP Platform** → mmahipal.reddy@gmail.com
- **CrowdGen** → mmahipal.reddy@gmail.com
- **Mercury** → mmahipal.reddy@gmail.com
- **Marketing Cloud** → mmahipal.reddy@gmail.com
- **Data Engineering** → mmahipal.reddy@gmail.com
- **Analytics** → mmahipal.reddy@gmail.com
- **Product Management** → mmahipal.reddy@gmail.com

### Email Delivery

**If You're Not Receiving Emails**:
1. **Check Spam Folder**: Automated emails may be filtered
2. **Search Email**: Look for "DepFlow" or "Dependency"
3. **Verify Address**: Confirm your email is correctly configured
4. **Contact Admin**: If emails continue to be missing

---

## User Roles and Permissions

### Administrator Role

**Full Platform Access**:
- ✅ Create new dependencies
- ✅ Edit any dependency (regardless of creator)
- ✅ Delete any dependency
- ✅ View all dependencies
- ✅ Access all team data
- ✅ Manage user accounts
- ✅ Configure system settings

**Identification**:
- User panel shows "Admin" role
- No restrictions on dependency actions

### Regular User Role

**Standard User Permissions**:
- ✅ Create new dependencies
- ✅ Edit dependencies they created
- ✅ View all dependencies (read-only for others' dependencies)
- ✅ Use all search and filtering features
- ✅ Receive email notifications
- ❌ Cannot edit others' dependencies
- ❌ Cannot delete others' dependencies
- ❌ No system administration access

**Identification**:
- User panel shows "User" role
- Edit/delete buttons disabled for others' dependencies

### Permission Indicators

**Visual Cues**:
- **Enabled Actions**: Clickable edit/delete buttons
- **Disabled Actions**: Grayed-out buttons with tooltips
- **Creator Information**: "Created by" shown for each dependency
- **Permission Messages**: Notifications when actions are restricted

---

## Best Practices

### Creating Effective Dependencies

**Naming Conventions**:
- Use clear, descriptive names
- Include technology/framework when relevant
- Example: "React User Authentication Component" vs "Auth Thing"

**Writing Descriptions**:
- Explain the purpose and scope
- Include technical requirements
- Mention dependencies on other components
- Add relevant context for team members

**Team Assignment**:
- Assign to the team most responsible
- Consider expertise and workload
- Communicate with team leads before major assignments

**Status Management**:
- Update status promptly as work progresses
- Use "BLOCKED" when waiting on external factors
- Move to "COMPLETED" only when fully done

**Priority Setting**:
- **HIGH**: Critical path items, security issues, blockers
- **MEDIUM**: Standard development tasks, planned features
- **LOW**: Nice-to-have features, technical debt, optimizations

### Search and Organization

**Effective Searching**:
- Use specific terms for precise results
- Search both names and descriptions
- Combine search with filters for best results

**Regular Maintenance**:
- Review and update old dependencies
- Archive or delete obsolete items
- Keep status information current

### Team Collaboration

**Communication**:
- Use detailed descriptions to explain requirements
- Include JIRA links for tracking
- Update status to keep teams informed

**Email Management**:
- Monitor team assignment notifications
- Respond promptly to new assignments
- Coordinate with team members on status updates

---

## Troubleshooting

### Common Issues and Solutions

#### Login Problems

**Cannot Access Login Page**:
- ✅ Check that the application server is running
- ✅ Verify the correct URL
- ✅ Clear browser cache and cookies
- ✅ Try a different browser

**Invalid Credentials Error**:
- ✅ Verify username and password spelling
- ✅ Check if Caps Lock is enabled
- ✅ Contact administrator to reset password
- ✅ Try the "Fill Admin Credentials" option for demo access

**Page Won't Load After Login**:
- ✅ Wait for complete page loading
- ✅ Refresh the browser
- ✅ Check browser JavaScript is enabled
- ✅ Try logging out and back in

#### Dependency Management Issues

**Cannot Create New Dependency**:
- ✅ Ensure all required fields are filled
- ✅ Check description is at least 10 characters
- ✅ Verify a team is selected
- ✅ Try refreshing the page

**Edit Button Not Working**:
- ✅ Confirm you created the dependency (or are admin)
- ✅ Check if button appears grayed out (permissions issue)
- ✅ Try logging out and back in
- ✅ Contact administrator if permissions seem incorrect

**Changes Not Saving**:
- ✅ Check internet connection
- ✅ Verify all required fields are complete
- ✅ Look for error notifications
- ✅ Try refreshing and re-entering changes

#### Search and Filter Issues

**Search Not Working**:
- ✅ Clear search field and try again
- ✅ Check spelling and try different terms
- ✅ Clear all filters and search again
- ✅ Refresh the page

**Filters Not Applying**:
- ✅ Try clearing all filters first
- ✅ Apply filters one at a time
- ✅ Check if any dependencies match your criteria
- ✅ Refresh the page

**Counters Not Updating**:
- ✅ Refresh the page
- ✅ Clear filters to see all dependencies
- ✅ Check if status changes were saved
- ✅ Log out and back in

#### Email Notification Issues

**Not Receiving Emails**:
- ✅ Check spam/junk folder
- ✅ Search for "DepFlow" in email
- ✅ Verify email address in system
- ✅ Contact administrator to check configuration

**Wrong Person Receiving Emails**:
- ✅ Verify team assignment is correct
- ✅ Contact administrator to update team owner mappings
- ✅ Check if team was recently changed

### Browser Compatibility

**Supported Browsers**:
- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Browser Issues**:
- Clear cache and cookies
- Disable browser extensions temporarily
- Try private/incognito mode
- Update to latest browser version

### Performance Issues

**Slow Loading**:
- ✅ Check internet connection speed
- ✅ Close other browser tabs
- ✅ Clear browser cache
- ✅ Try a different browser

**Application Hanging**:
- ✅ Wait for page to fully load
- ✅ Refresh the page
- ✅ Check browser console for errors
- ✅ Contact technical support

---

## Frequently Asked Questions

### General Questions

**Q: What is DepFlow used for?**
A: DepFlow is an Enterprise Dependency Management Platform that helps organizations track, manage, and monitor software dependencies throughout their development lifecycle.

**Q: Who can use DepFlow?**
A: DepFlow is designed for development teams, project managers, and IT administrators who need to track software dependencies and coordinate team efforts.

**Q: Is my data secure in DepFlow?**
A: Yes, DepFlow implements enterprise-grade security measures including secure authentication, data encryption, and SOC 2 compliance standards.

### Account and Access

**Q: How do I get access to DepFlow?**
A: Contact your system administrator or IT department to request access credentials.

**Q: Can I change my password?**
A: Contact your administrator to reset your password. Self-service password reset may be available depending on your organization's configuration.

**Q: What if I forget my login credentials?**
A: Use the admin credentials feature for demo access, or contact your administrator for password reset assistance.

### Using the Platform

**Q: How many dependencies can I create?**
A: There's no specific limit on the number of dependencies you can create. The platform is designed to handle enterprise-scale dependency management.

**Q: Can I bulk upload dependencies?**
A: Currently, dependencies must be created individually through the web interface. Bulk import features may be available in future versions.

**Q: Can I export dependency data?**
A: Data export capabilities depend on your organization's configuration. Contact your administrator about export options.

**Q: How do I assign dependencies to multiple teams?**
A: Currently, each dependency can be assigned to one team. Consider creating separate dependencies for different team responsibilities.

### Email Notifications

**Q: Why am I not receiving email notifications?**
A: Check your spam folder, verify your email address is correctly configured, and ensure your email server accepts emails from the DepFlow system.

**Q: Can I turn off email notifications?**
A: Email notification preferences are configured at the system level. Contact your administrator about notification settings.

**Q: Who receives emails when I assign a dependency?**
A: Emails are sent to the configured team owner for the assigned team. Your administrator manages these mappings.

### Technical Questions

**Q: What browsers are supported?**
A: DepFlow works best with modern browsers: Chrome, Firefox, Safari, and Edge (latest versions recommended).

**Q: Can I use DepFlow on mobile devices?**
A: DepFlow is optimized for desktop use. While it works on tablets and phones, the full interface is best experienced on larger screens.

**Q: Is there an API available?**
A: Yes, DepFlow provides REST API endpoints for integration with other systems. Contact your administrator for API documentation and access.

**Q: Can DepFlow integrate with JIRA?**
A: DepFlow allows you to add JIRA ticket links to dependencies. Additional JIRA integration features may be available depending on configuration.

### Troubleshooting

**Q: The page won't load properly. What should I do?**
A: Try refreshing the page, clearing your browser cache, disabling extensions, or using a different browser.

**Q: I can't edit a dependency. Why?**
A: You can only edit dependencies you created unless you're an administrator. Check if the edit button is available and clickable.

**Q: The counters don't match what I see in the table. What's wrong?**
A: Try refreshing the page or clearing all filters. Counters should reflect the total count, not filtered results.

**Q: How do I report a bug or request a feature?**
A: Contact your system administrator or IT support team to report technical issues or suggest new features.

---

## Getting Help

### Support Resources

1. **This User Manual**: Comprehensive guide to all features
2. **In-App Help**: Tooltips and contextual help throughout the interface
3. **Administrator Support**: Your internal IT team or system administrator
4. **Training Sessions**: Contact your administrator about user training availability

### Contact Information

For technical support and questions:
- **Internal IT Support**: Contact your organization's IT helpdesk
- **System Administrator**: Your designated DepFlow administrator
- **User Training**: Request training sessions from your admin team

### Feedback and Suggestions

We welcome your feedback to improve DepFlow:
- Report bugs or issues to your administrator
- Suggest new features or improvements
- Share usability feedback
- Participate in user surveys when available

---

*This manual was last updated for DepFlow version 1.0.0. For the most current information, consult with your system administrator.*

