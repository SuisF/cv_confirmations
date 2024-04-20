export interface cvForm {
    id?:            number;
    name:           string;
    position:       string;
    profile_pict:   string;
    about_me:       string;
    contact:        string;
    experience:     string;
    skills:         string;
    education:      string;
    language:       string;
    createdAt?:     Date;
    updatedAt?:     Date | null;
}