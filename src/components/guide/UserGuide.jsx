import React from "react";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpIcon from "@mui/icons-material/Help";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoIcon from "@mui/icons-material/Info";
import CloudIcon from "@mui/icons-material/Cloud";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MessageIcon from "@mui/icons-material/Message";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigationIcon from "@mui/icons-material/Navigation";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`guide-tabpanel-${index}`}
      aria-labelledby={`guide-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserGuide = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          מדריך למשתמש - פורטל קורסים ONO
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            ברוכים הבאים למערכת פורטל הקורסים המתקדמת של המרכז האקדמי אונו.
            המערכת מבוססת על Firebase ומאפשרת ניהול מלא של קורסים, סטודנטים,
            מטלות והודעות בזמן אמת.
          </Typography>
        </Alert>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
          <Chip
            icon={<CloudIcon />}
            label="Firebase Database"
            color="primary"
          />
          <Chip
            icon={<NavigationIcon />}
            label="React Router"
            color="secondary"
          />
          <Chip icon={<InfoIcon />} label="Real-time Updates" color="success" />
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="guide tabs"
          centered
          sx={{ mb: 2 }}
        >
          <Tab icon={<AdminPanelSettingsIcon />} label="פורטל מנהל" />
          <Tab icon={<SchoolIcon />} label="פורטל סטודנט" />
          <Tab icon={<CloudIcon />} label="מאפיינים טכניים" />
          <Tab icon={<HelpIcon />} label="שאלות נפוצות" />
        </Tabs>

        {/* Admin Portal Guide */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            <AdminPanelSettingsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            הנחיות לשימוש בפורטל המנהל
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>שימו לב:</strong> פורטל המנהל כולל הודעות חשובות בחלק
              העליון של המסך. אנא עקבו אחר הודעות אלו למידע עדכני על מועדי הגשת
              ציונים ותגובות.
            </Typography>
          </Alert>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <DashboardIcon sx={{ mr: 1 }} /> לוח בקרה
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                לוח הבקרה מציג סיכום נתונים כללי של המערכת בזמן אמת, הכולל מספר
                הקורסים, המטלות, ההודעות והסטודנטים במערכת.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">מה תראו בלוח הבקרה:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="סטטיסטיקות כלליות - קורסים, מטלות, הודעות וסטודנטים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הודעות חשובות מהמערכת (למשל, מועדי הגשת ציונים)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כרטיסיות אינטראקטיביות עם אפקטים ויזואליים" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ViewListIcon sx={{ mr: 1 }} /> ניהול קורסים מתקדם
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                מערכת ניהול קורסים מתקדמת עם יכולות מלאות של הוספה, עריכה, מחיקה
                וניהול מטלות והודעות.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך להוסיף קורס חדש:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='לחץ על "הוסף קורס חדש" בעמוד רשימת הקורסים' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מלא את כל הפרטים: שם קורס, מרצה, יום, שעה ותיאור" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="המערכת תיצור אוטומטית קוד קורס ייחודי בן 4 ספרות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הקורס יישמר בבסיס הנתונים Firebase עם כל הקולקציות הנדרשות" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">ניהול קורס מתקדם:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='לחץ על "ניהול" ליד הקורס הרצוי' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="בחר מבין 3 לשוניות: מטלות, הודעות וסטודנטים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כל שינוי נשמר אוטומטית בבסיס הנתונים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="תוכל לנווט בין הלשוניות ללא איבוד מידע" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">ניהול מטלות:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הוסף מטלות עם כותרת, תיאור ותאריך הגשה" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="ערוך מטלות קיימות עם טופס מובנה" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מחק מטלות עם אישור ובטיחות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אימות תאריכים - מניעת הגשה בעבר" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">ניהול הודעות:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <MessageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="שלח הודעות לכל סטודנטי הקורס" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הודעות נשמרות עם חותמת זמן אוטומטית" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מחק הודעות עם אישור" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הודעות מועברות בזמן אמת לפורטל הסטודנט" />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography fontWeight="bold">מאפיינים נוספים:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אישורי מחיקה לבטיחות מקסימלית" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הודעות הצלחה ושגיאה ברורות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="טעינה אסינכרונית - המערכת תמיד מגיבה" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <GroupsIcon sx={{ mr: 1 }} /> ניהול סטודנטים מתקדם
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                מערכת ניהול סטודנטים מקיפה עם אימות נתונים וניהול רישום לקורסים.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">
                  איך להוסיף סטודנט חדש:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='לחץ על "הוסף סטודנט חדש" ברשימת הסטודנטים' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הזן תעודת זהות (9 ספרות) - המערכת תבדוק ייחודיות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מלא שם פרטי ומשפחה (מינימום 2 תווים)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="בחר תאריך לידה עם בורר תאריכים מתקדם" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הזן כתובת אימייל תקינה" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">אימות נתונים אוטומטי:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="בדיקת תקינות תעודת זהות (9 ספרות)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אימות כתובת אימייל" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="בדיקת תאריך לידה (לא בעתיד)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הודעות שגיאה ברורות וידידותיות" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">
                  רישום סטודנטים לקורסים:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='פתח קורס דרך "ניהול" ועבור ללשונית "סטודנטים"' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='לחץ על "הוסף סטודנט" וחפש בין הסטודנטים הזמינים' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="בחר מספר סטודנטים בו-זמנית" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הרישום מתבצע בבסיס הנתונים בשני הכיוונים" />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography fontWeight="bold">עריכה ומחיקה:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="ערוך פרטי סטודנט (לא ניתן לשנות תעודת זהות)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מחק סטודנט עם אישור בטיחות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הסר סטודנט מקורס ספציפי ללא מחיקה מהמערכת" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <NavigationIcon sx={{ mr: 1 }} /> ניווט וחוויית משתמש
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                המערכת כוללת ניווט מתקדם וחוויית משתמש משופרת לשימוש נוח ויעיל.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">ניווט מבוסס URL:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כל עמוד בעל כתובת ייחודית - ניתן לסמן במועדפים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כפתורי הדפדפן (אחורה/קדימה) עובדים בצורה מושלמת" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="ניתן לשתף קישורים ישירים לעמודים ספציפיים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הכתובת מתעדכנת אוטומטית בעת מעבר בין עמודים" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">משוב ויזואלי:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אנימציות טעינה עם אחוזי התקדמות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הודעות הצלחה ושגיאה ברורות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אישורי מחיקה עם הסברים מפורטים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כפתורים נעולים במהלך פעולות לבטיחות" />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography fontWeight="bold">רספונסיביות:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="עיצוב מותאם לכל גדלי מסכים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="תפריט צדדי מתקפל במכשירים קטנים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="טבלאות מותאמות למובייל" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* Student Portal Guide */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            הנחיות לשימוש בפורטל הסטודנט
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              פורטל הסטודנט מאפשר צפייה בקורסים, מטלות והודעות בזמן אמת. המערכת
              כוללת בחירת סטודנט דינמית וניווט מתקדם.
            </Typography>
          </Alert>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="student-panel1-content"
              id="student-panel1-header"
            >
              <Typography variant="h6">בחירת סטודנט וניווט</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                המערכת מאפשרת לבחור סטודנט מתוך רשימה מלאה ולצפות בכל הקורסים
                והמטלות שלו.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך להתחיל:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='היכנס לפורטל הסטודנט דרך "פורטל הסטודנט" בתפריט העליון' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='בחר סטודנט מהרשימה הנפתחת "בחר סטודנט"' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="הרשימה מציגה שם מלא ותעודת זהות לזיהוי קל" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="המערכת תטען אוטומטית את כל הקורסים הרלוונטיים" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">ניווט חכם:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כתובת ה-URL מתעדכנת בהתאם לסטודנט ולעמוד הנבחרים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="ניתן לשתף קישור ישיר לעמוד ספציפי של סטודנט" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="פירורי לחם מציגים את המסלול הנוכחי" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כפתורי הדפדפן עובדים בצורה מושלמת" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="student-panel2-content"
              id="student-panel2-header"
            >
              <Typography variant="h6">לוח בקרה אישי</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                לוח בקרה מותאם אישית לכל סטודנט עם סטטיסטיקות מקיפות.
              </Typography>

              <Box>
                <Typography fontWeight="bold">מה תמצאו בלוח הבקרה:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מספר הקורסים שהסטודנט רשום אליהם" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="סך כל המטלות מכל הקורסים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מספר ההודעות מכל הקורסים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כרטיסיות אינטראקטיביות עם אפקטים חזותיים" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="student-panel3-content"
              id="student-panel3-header"
            >
              <Typography variant="h6">צפייה בקורסים</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                מערכת צפייה מתקדמת בקורסים עם מעבר חלק לפרטים המלאים.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">רשימת הקורסים:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ViewListIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="טבלה מסודרת עם כל הקורסים שהסטודנט רשום אליהם" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מידע על קוד קורס, שם, מרצה ומועדים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='כפתור "צפה בקורס" לכל קורס' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אם הסטודנט לא רשום לקורסים - הודעה מתאימה" />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography fontWeight="bold">צפייה מפורטת בקורס:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="פרטים מלאים על הקורס: שם, מרצה, מועדים ותיאור" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='לשונית "מטלות" עם כל המטלות וחמודי ההגשה' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MessageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary='לשונית "הודעות" עם כל הודעות המרצה' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כפתור חזרה לרשימת הקורסים" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="student-panel4-content"
              id="student-panel4-header"
            >
              <Typography variant="h6">צפייה מאוחדת במטלות</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                מערכת צפייה מאוחדת בכל המטלות מכל הקורסים במסך אחד.
              </Typography>

              <Box>
                <Typography fontWeight="bold">
                  מה כוללת הצפייה במטלות:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="טבלה מאוחדת עם מטלות מכל הקורסים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מיון אוטומטי לפי תאריך הגשה (המוקדמות בראש)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מידע על שם הקורס, שם המטלה, תאריך הגשה ותיאור" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="לחיצה על שורה מעבירה ישירות לקורס הרלוונטי" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אפקטים ויזואליים להדגשת עמלות דחופות" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* Technical Features Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            <CloudIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            מאפיינים טכניים ויכולות מתקדמות
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              המערכת בנויה על טכנולוגיות מתקדמות ומספקת חוויית שימוש מהירה
              ויציבה.
            </Typography>
          </Alert>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="tech-panel1-content"
              id="tech-panel1-header"
            >
              <Typography variant="h6">Firebase Database</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                המערכת מבוססת על Firebase Firestore - בסיס נתונים NoSQL מתקדם
                ובטוח.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">יתרונות Firebase:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CloudIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="שמירה בענן - גיבוי אוטומטי ובטיחות גבוהה" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="עדכונים בזמן אמת - שינויים נראים מיד" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="סקלביליות גבוהה - יכול לתמוך במאות אלפי סטודנטים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אבטחה מתקדמת עם הצפנה מלאה" />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography fontWeight="bold">מבנה בסיס הנתונים:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="קולקציית קורסים עם תתי-קולקציות למטלות והודעות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="קולקציית סטודנטים עם קשרים לקורסים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="מבנה מותאם לביצועים מיטביים" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="tech-panel2-content"
              id="tech-panel2-header"
            >
              <Typography variant="h6">
                React Router ו-URL Management
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                ניווט מתקדם עם React Router לחוויית שליפה יישומית מלאה.
              </Typography>

              <Box>
                <Typography fontWeight="bold">יכולות הניווט:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <NavigationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="כתובות URL ייחודיות לכל עמוד ומצב" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="תמיכה בכפתורי הדפדפן (אחורה/קדימה)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="ניתן לשמור בהיסטוריה ובמועדפים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="פרמטרים דינמיים ב-URL (סטודנט, קורס, עמוד)" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="tech-panel3-content"
              id="tech-panel3-header"
            >
              <Typography variant="h6">Material-UI ועיצוב רספונסיבי</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                עיצוב מקצועי ומותאם לכל הפלטפורמות באמצעות Material-UI.
              </Typography>

              <Box>
                <Typography fontWeight="bold">מאפיינים עיצוביים:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="תמיכה מלאה בכתב עברי וכיוון RTL" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="עיצוב רספונסיבי לכל גדלי המסכים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="צבעים ופונטים מותאמים למוסד האקדמי" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אנימציות ומעברים חלקים" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="tech-panel4-content"
              id="tech-panel4-header"
            >
              <Typography variant="h6">אבטחה ובטיחות נתונים</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                המערכת כוללת מספר שכבות הגנה ובטיחות נתונים.
              </Typography>

              <Box>
                <Typography fontWeight="bold">מנגנוני הגנה:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אישורי מחיקה מרובים לפעולות חשובות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="אימות נתונים בצד הלקוח והשרת" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="בטיחות מפני לחיצות כפולות" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="ניהול שגיאות מתקדם עם התאוששות" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* FAQ Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            <HelpIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            שאלות נפוצות
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">איך אני נרשם לקורס?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                כסטודנט, אינך יכול להירשם באופן עצמאי לקורסים. רישום לקורסים
                מתבצע על ידי מנהל המערכת דרך פורטל המנהל.
              </Typography>
              <Typography>
                <strong>תהליך הרישום:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="פנה למנהל המערכת או למזכירות המחלקה" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="המנהל ירשום אותך דרך פורטל המנהל" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="הקורס יופיע אוטומטית בפורטל הסטודנט שלך" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                האם ניתן להגיש מטלות דרך המערכת?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                בגרסה הנוכחית, המערכת מציגה את המטלות, תיאוריהן ומועדי ההגשה.
                הגשת המטלות עדיין מתבצעת במערכת המודל של המוסד האקדמי.
              </Typography>
              <Typography>
                <strong>מה המערכת כוללת כרגע:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="צפייה מפורטת בכל המטלות" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="תיאור מלא של כל מטלה" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="מועדי הגשה ברורים" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="מיון אוטומטי לפי דחיפות" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                מה לעשות אם אני לא רואה את הקורס שלי?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                אם אינך רואה קורס שאתה אמור להיות רשום אליו, ייתכן שיש בעיה
                ברישום.
              </Typography>
              <Typography>
                <strong>צעדים לפתרון:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="ודא שבחרת את הסטודנט הנכון מהרשימה" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="רענן את הדף (F5) לטעינה מחדש" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="פנה למנהל המערכת לבדיקת הרישום" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="בדוק שפרטיך נכונים במערכת" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                האם המערכת עובדת על מכשירים ניידים?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                כן! המערכת בנויה להיות רספונסיבית ומתאימה לכל גדלי המסכים.
              </Typography>
              <Typography>
                <strong>תמיכה במכשירים:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="מחשבים שולחניים ונישאים" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="טאבלטים בכל הגדלים" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="טלפונים חכמים" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="כל הדפדפנים המודרניים" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                איך אני מעדכן את פרטי הקשר שלי?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                עדכון פרטי קשר מתבצע על ידי מנהל המערכת דרך פורטל המנהל.
              </Typography>
              <Typography>
                <strong>תהליך העדכון:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="פנה למזכירות המחלקה עם פרטיך החדשים" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="צרף צילום תעודת זהות לאימות" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="המנהל יעדכן את פרטיך במערכת" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="השינויים יעודכנו מיד בכל המערכת" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                האם ניתן לצפות בציונים במערכת?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                בגרסה הנוכחית, המערכת אינה מציגה ציונים. זוהי מערכת ניהול קורסים
                שמתמקדת במטלות והודעות.
              </Typography>
              <Typography>
                <strong>איפה לצפות בציונים:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="מערכת הציונים הנפרדת של המוסד האקדמי" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="פורטל הסטודנטים הראשי של המוסד" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="מערכת המודל למטלות וציונים" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                המערכת איטית - מה אפשר לעשות?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                המערכת מבוססת על Firebase ובדרך כלל מהירה מאוד. אם אתה חווה
                איטיות, נסה את הפתרונות הבאים:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="רענן את הדף (F5) או סגור ופתח מחדש" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="בדוק את חיבור האינטרנט שלך" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="נקה את הקאש של הדפדפן" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="נסה דפדפן אחר (Chrome, Firefox, Safari)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="אם הבעיה נמשכת - פנה לתמיכה טכנית" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default UserGuide;
