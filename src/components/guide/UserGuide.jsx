import React from 'react';
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
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList';
import GroupsIcon from '@mui/icons-material/Groups';

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserGuide = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          מדריך למשתמש - פורטל קורסים ONO
        </Typography>
        
        <Typography variant="body1" paragraph>
          ברוכים הבאים למערכת פורטל הקורסים של המרכז האקדמי אונו. מערכת זו מאפשרת למנהלי המערכת לנהל קורסים, סטודנטים, מטלות והודעות, ולסטודנטים לצפות בקורסים שלהם, מטלות והודעות.
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="guide tabs"
          centered
          sx={{ mb: 2 }}
        >
          <Tab icon={<AdminPanelSettingsIcon />} label="פורטל מנהל" />
          <Tab icon={<SchoolIcon />} label="פורטל סטודנט" />
          <Tab icon={<HelpIcon />} label="שאלות נפוצות" />
        </Tabs>

        {/* Admin Portal Guide */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            <AdminPanelSettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            הנחיות לשימוש בפורטל המנהל
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <DashboardIcon sx={{ mr: 1 }} /> לוח בקרה
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                לוח הבקרה מציג סיכום נתונים כללי של המערכת, הכולל מספר הקורסים, המטלות, ההודעות והסטודנטים במערכת.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך להשתמש:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="צפה בכרטיסיות הנתונים המסכמות את מצב המערכת" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="עקוב אחר הודעות חשובות המופיעות בחלק העליון" />
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
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewListIcon sx={{ mr: 1 }} /> ניהול קורסים
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                הוספה, עריכה וניהול של קורסים במערכת, כולל הוספת מטלות, הודעות ורישום סטודנטים.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך להוסיף קורס חדש:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "הוספת קורס" בתפריט הצד' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="מלא את פרטי הקורס בטופס: שם, מרצה, יום, שעה ותיאור" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "הוסף קורס" לשמירה' />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך לנהל קורס:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "ניהול" ליד הקורס הרצוי ברשימת הקורסים' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="השתמש בלשוניות כדי לנהל מטלות, הודעות וסטודנטים" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='כדי להוסיף מטלה, לחץ על "הוסף מטלה" ומלא את הטופס' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='כדי להוסיף הודעה, לחץ על "הוסף הודעה" ומלא את הטופס' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='כדי להוסיף סטודנטים לקורס, לחץ על "הוסף סטודנט" ובחר מהרשימה' />
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
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupsIcon sx={{ mr: 1 }} /> ניהול סטודנטים
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                הוספה, עריכה וניהול של סטודנטים במערכת.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך להוסיף סטודנט חדש:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "הוספת סטודנט" בתפריט הצד' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="מלא את פרטי הסטודנט בטופס: תעודת זהות, שם פרטי, שם משפחה, תאריך לידה ואימייל" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "הוסף סטודנט" לשמירה' />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך לערוך פרטי סטודנט:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "ערוך" ליד הסטודנט הרצוי ברשימת הסטודנטים' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="עדכן את הפרטים בטופס" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "עדכן סטודנט" לשמירת השינויים' />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography fontWeight="bold">איך לרשום סטודנט לקורס:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='פתח את הקורס הרצוי על ידי לחיצה על "ניהול"' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='עבור ללשונית "סטודנטים"' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='לחץ על "הוסף סטודנט" ובחר מהרשימה' />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* Student Portal Guide */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            הנחיות לשימוש בפורטל הסטודנט
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="student-panel1-content"
              id="student-panel1-header"
            >
              <Typography variant="h6">צפייה בקורסים</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                פורטל הסטודנט מאפשר לך לצפות בכל הקורסים שנרשמת אליהם, המטלות וההודעות הקשורות אליהם.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold">איך לצפות בפרטי הקורסים:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="היכנס לפורטל הסטודנט דרך כפתור 'פורטל הסטודנט' בתפריט העליון" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="הקורסים שלך יופיעו ברשימה בעמוד הראשי" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="לחץ על קורס כדי לראות את פרטיו המלאים, המטלות וההודעות הקשורות אליו" />
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
              <Typography variant="h6">צפייה במטלות</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                המערכת מאפשרת לך לראות את כל המטלות בקורסים שנרשמת אליהם, כולל מועדי הגשה.
              </Typography>
              
              <Box>
                <Typography fontWeight="bold">איך לצפות במטלות:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="בחר קורס מהרשימה" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='עבור ללשונית "מטלות"' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="כאן תוכל לראות את כל המטלות לקורס, כולל תיאור ומועד הגשה" />
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
              <Typography variant="h6">צפייה בהודעות</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                המרצים ומנהלי המערכת יכולים לפרסם הודעות לקורסים. כאן תוכל לצפות בהן.
              </Typography>
              
              <Box>
                <Typography fontWeight="bold">איך לצפות בהודעות:</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="בחר קורס מהרשימה" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary='עבור ללשונית "הודעות"' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="כאן תוכל לקרוא את כל ההודעות שפורסמו לקורס" />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* FAQ Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            <HelpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            שאלות נפוצות
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">איך אני נרשם לקורס?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                כסטודנט, אינך יכול להירשם באופן עצמאי לקורסים. רישום לקורסים מתבצע על ידי מנהל המערכת. אם ברצונך להירשם לקורס מסוים, פנה למנהל המערכת או למזכירות המחלקה.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">האם ניתן להגיש מטלות דרך המערכת?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                בגרסה הנוכחית, המערכת מציגה את המטלות ומועדי ההגשה בלבד. הגשת המטלות מתבצעת במערכת המודל של המוסד האקדמי. בעתיד מתוכננת הוספת פונקציונליות להגשת מטלות ישירות דרך המערכת.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">מה לעשות אם שכחתי את הסיסמה שלי?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                במקרה של שכחת סיסמה, יש לפנות למוקד התמיכה של המוסד האקדמי בטלפון 03-1234567 או במייל support@example.ac.il. לחלופין, ניתן להשתמש בקישור "שחזור סיסמה" בעמוד הכניסה.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">איך אני מעדכן את פרטי הקשר שלי?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                עדכון פרטי קשר כגון כתובת מייל או מספר טלפון מתבצע על ידי פנייה למזכירות המחלקה. בבקשה שלח מייל עם פרטיך המעודכנים וצילום תעודת זהות לכתובת secretary@example.ac.il.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">האם ניתן לצפות בציונים במערכת?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                בגרסה הנוכחית, המערכת אינה מציגה ציונים. צפייה בציונים מתאפשרת דרך מערכת הציונים הנפרדת של המוסד האקדמי. בעתיד מתוכננת אינטגרציה של מערכת הציונים עם פורטל זה.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default UserGuide;