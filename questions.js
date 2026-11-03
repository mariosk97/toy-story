
const questionSets = {
    easy: [
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά είναι ζώο;",
            answers: ["Σκύλος", "Καρέκλα", "Μολύβι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι χρώμα έχει το γρασίδι;",
            answers: ["Μπλε", "Πράσινο", "Μαύρο"],
            correctAnswer: 1
        },
        {
            type: "typing",
            question: "Πού ζει το ψάρι;",
            choices: ["στο νερό", "πάνω στα δέντρα"],
            answers: ["στο νερό"]
        },
        {
            type: "multipleChoice",
            question: "Πόσα πόδια έχει μια γάτα;",
            answers: ["Δύο", "Τέσσερα", "Έξι"],
            correctAnswer: 1
        },
        {
            type: "multipleChoice",
            question: "Με τι ακούμε τους ήχους;",
            answers: ["Με τα αυτιά", "Με τα γόνατα", "Με τα χέρια"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά είναι φρούτο;",
            answers: ["Μήλο", "Παπούτσι", "Βιβλίο"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι βάζουμε στα πόδια μας όταν βγαίνουμε έξω;",
            answers: ["Γάντια", "Παπούτσια", "Καπέλο"],
            correctAnswer: 1
        },
        {
            type: "multipleChoice",
            question: "Ποιο ζώο λέει «γαβ»;",
            answers: ["Σκύλος", "Γάτα", "Πάπια"],
            correctAnswer: 0
        },
        {
            type: "typing",
            question: "Πού κελαηδάει το πουλί;",
            choices: ["πάνω στο δέντρο", "μέσα στη θάλασσα"],
            answers: ["πάνω στο δέντρο"]
        },
        {
            type: "multipleChoice",
            question: "Τι χρησιμοποιούμε για να γράψουμε;",
            answers: ["Μολύβι", "Πιάτο", "Μαξιλάρι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά πετάει;",
            answers: ["Αεροπλάνο", "Ποδήλατο", "Καρέκλα"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποια εποχή κάνει περισσότερη ζέστη;",
            answers: ["Χειμώνας", "Καλοκαίρι", "Φθινόπωρο"],
            correctAnswer: 1
        },
        {
            type: "multipleChoice",
            question: "Ποιο ζώο ζει σε φάρμα;",
            answers: ["Αγελάδα", "Καρχαρίας", "Πιγκουίνος"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι χρησιμοποιούμε για να βλέπουμε την ώρα;",
            answers: ["Ρολόι", "Ποτήρι", "Κουτάλι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά είναι μέσο μεταφοράς;",
            answers: ["Λεωφορείο", "Μαξιλάρι", "Πορτοκάλι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι χρειάζεται ένα φυτό για να μεγαλώσει;",
            answers: ["Νερό", "Σοκολάτα", "Παπούτσια"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο μέρος του σώματος χρησιμοποιούμε για να περπατάμε;",
            answers: ["Πόδια", "Αυτιά", "Μαλλιά"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο ζώο έχει προβοσκίδα;",
            answers: ["Ελέφαντας", "Σκύλος", "Κουνέλι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι κάνουμε όταν διψάμε;",
            answers: ["Πίνουμε νερό", "Φοράμε κάλτσες", "Κοιμόμαστε όρθιοι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά βρίσκεται στον ουρανό τη νύχτα;",
            answers: ["Αστέρια", "Ψάρια", "Καρέκλες"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Πόσες ρόδες έχει ένα ποδήλατο;",
            answers: ["Δύο", "Τέσσερις", "Έξι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά είναι μουσικό όργανο;",
            answers: ["Πιάνο", "Τραπέζι", "Παράθυρο"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο ζώο κολυμπάει;",
            answers: ["Ψάρι", "Κότα", "Πρόβατο"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι χρησιμοποιούμε για να κόψουμε χαρτί;",
            answers: ["Ψαλίδι", "Ποτήρι", "Κουβέρτα"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά είναι λαχανικό;",
            answers: ["Καρότο", "Παγωτό", "Μπισκότο"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι φοράμε όταν βρέχει για να μη βραχούμε;",
            answers: ["Αδιάβροχο", "Μαγιό", "Πιτζάμες"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Ποιο ζώο έχει μακρύ λαιμό;",
            answers: ["Καμηλοπάρδαλη", "Σκαντζόχοιρος", "Χελώνα"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι κάνουμε με μια οδοντόβουρτσα;",
            answers: ["Βουρτσίζουμε τα δόντια", "Χτενίζουμε τα μαλλιά", "Σκουπίζουμε το πάτωμα"],
            correctAnswer: 0
        },
		{
			type: "multipleChoice",
			question: "Ο μαθητής _____ το βιβλίο.",
			answers: ["διαβάζει", "διαβάζω", "διαβάζουν"],
			correctAnswer: 0
		},
		{
			type: "multipleChoice",
			question: "_____ ποτήρια υπάρχουν στο τραπέζι;",
			answers: ["Πόσοι", "Πόσες", "Πόσα"],
			correctAnswer: 2
		},
		{
			type: "multipleChoice",
			question: "Η Μαρία _____ ένα τραγούδι.",
			answers: ["τραγουδάω", "τραγουδάει", "τραγουδούν"],
			correctAnswer: 1
		},
		{
			type: "multipleChoice",
			question: "Εμείς _____ στο πάρκο.",
			answers: ["περπατάμε", "περπατάει", "περπατάω"],
			correctAnswer: 0
		},
		{
			type: "multipleChoice",
			question: "_____ παιδιά παίζουν στην αυλή;",
			answers: ["Πόσοι", "Πόσες", "Πόσα"],
			correctAnswer: 0
		},
		{
			type: "multipleChoice",
			question: "Η Ελένη φοράει _____ κόκκινη μπλούζα.",
			answers: ["ένας", "μία", "ένα"],
			correctAnswer: 1
		},
		{
			type: "multipleChoice",
			question: "Τα κορίτσια _____ χορεύουν.",
			answers: ["όμορφα", "όμορφος", "όμορφη"],
			correctAnswer: 0
		},
		{
			type: "multipleChoice",
			question: "Ο Νίκος και ο Γιώργος _____ ποδόσφαιρο.",
			answers: ["παίζω", "παίζει", "παίζουν"],
			correctAnswer: 2
		},
		{
			type: "multipleChoice",
			question: "_____ είναι η τσάντα σου;",
			answers: ["Πού", "Ποιος", "Πόσοι"],
			correctAnswer: 0
		},
		{
			type: "multipleChoice",
			question: "Το κορίτσι πλένει _____ χέρια του.",
			answers: ["τα", "τους", "τις"],
			correctAnswer: 0
		},
		{
			type: "multipleChoice",
			question: "Εγώ _____ κάθε πρωί πρωινό.",
			answers: ["τρώει", "τρώω", "τρώνε"],
			correctAnswer: 1
		},
		{
			type: "multipleChoice",
			question: "_____ μήλα υπάρχουν στο καλάθι;",
			answers: ["Πόσοι", "Πόσες", "Πόσα"],
			correctAnswer: 2
		},
		{
			type: "multipleChoice",
			question: "Ο πατέρας _____ το αυτοκίνητο.",
			answers: ["οδηγώ", "οδηγούν", "οδηγεί"],
			correctAnswer: 2
		},
		{
			type: "multipleChoice",
			question: "Τα παιδιά πηγαίνουν _____ σχολείο.",
			answers: ["στο", "στη", "στον"],
			correctAnswer: 0
		}
    ],

    hard: [
        {
            type: "multipleChoice",
            question: "Πόσο κάνει 5 + 3;",
            answers: ["7", "8", "9"],
            correctAnswer: 1
        },
        {
            type: "typing",
            question: "Πού ζει το ψάρι;",
            choices: ["στο νερό", "πάνω στα δέντρα"],
            answers: ["στο νερό"]
        },
        {
            type: "multipleChoice",
            question: "Ποιος μήνας έρχεται μετά τον Μάρτιο;",
            answers: ["Φεβρουάριος", "Απρίλιος", "Ιούνιος"],
            correctAnswer: 1
        },
        {
            type: "multipleChoice",
            question: "Πόσες ημέρες έχει μια εβδομάδα;",
            answers: ["Πέντε", "Επτά", "Δέκα"],
            correctAnswer: 1
        },
        {
            type: "multipleChoice",
            question: "Πόσο κάνει 4 + 6;",
            answers: ["9", "10", "12"],
            correctAnswer: 1
        },
    ]
};

export { questionSets };
