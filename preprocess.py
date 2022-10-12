from pathlib import Path
import re
import argparse
from datetime import datetime as _datetime
from typing import Dict, List, Union

import pandas as pd


from io import StringIO # Python3 use: from io import StringIO
import sys

old_stdout = sys.stdout
# sys.stdout = mystdout = StringIO()
sys.stdout = mystdout = open('log.txt', 'w', encoding='utf-8')


EXCLUDE_FIRST = 0
RESULTS_FOLDER = './pcibex_results'
# RESULTS_FILE = 'results_03-10_03.csv'
# RESULTS_FILE = 'results_new_random.csv'
RESULTS_FILE = 'results_03-11_N124.csv'
# RESULTS_FILE = 'results_.csv'
results_path = Path(RESULTS_FOLDER) / Path(RESULTS_FILE)

ANSWERS_NAME = 'answers.csv'
PERSONS_NAME = 'participants.csv'

EXPERIMENT_LABELS = ('test', 'fillers')

INCLUDE_PERSON = True

EOF = object()


def get_lines(results_path: Path):
    results_lines = []
    with open(results_path, 'r', encoding='utf-8') as res:
        for line in res:
            results_lines.append(line.rstrip('\n'))

    results_lines.append(EOF)
    return results_lines


def get_column_name(line: str, maxsplit=1):
    line_elements = [el.rstrip('.') for el in
                     line.split(' ', maxsplit=maxsplit)]
    return int(line_elements[0]), line_elements[1]


def get_row(line: str, names: List[str], delete_controller=False):
    # print(line, names)
    l_names = len(names)
    
    els = line.split(',')
    l_els = len(els)
    
    print(l_names, l_els, l_names == l_els)
    # if l_names != l_els:
    longer = els if l_els > l_names else names
    other = els if longer is names else names
    
    
    print(f"i - elements - names" if longer is els else f"i - names - elements")
    for i, _ in enumerate(longer):
        print(f"{i} - {_} - {other[i] if i < len(other) else ''}")

    
    if delete_controller and 'Controller name' in names:
        names.remove('Controller name')

    return {names[i]: value for i, value in enumerate(line.split(','))}


def parse_lines(results_lines: List[str]):
    answers_by_person = []

    person = {}
    rows_person = []

    base_column_names = []
    prev_line_type = None
    seen_row = False
    temp_column_names = []
    temp_column_first_index = None

    for i, line in enumerate(results_lines):
        print(i, line)
    
        if line is EOF:
            answers_by_person.append(person)

        elif line.startswith("#"):  # column description line
            remainder = line.lstrip("# ")

            if not remainder or remainder.startswith("Columns"):
                continue
            elif remainder.startswith("Design"):
                person['design'] = remainder
            elif remainder.startswith("USER AGENT: "):
                user_agent = remainder.lstrip("USER AGENT: ")
                person['user_agent'] = user_agent
            elif re.search("^\d+\.", remainder):
                column_number, column_name = get_column_name(remainder)

                if not seen_row:
                    base_column_names.append(column_name)
                elif prev_line_type == 'column_spec':
                    temp_column_names.append(column_name)
                elif prev_line_type == 'row':
                    temp_column_names = [column_name]
                    temp_column_first_index = column_number - 1  # zero-based indexing
                    # print(base_column_names, temp_column_names)

                prev_line_type = 'column_spec'

            elif remainder.startswith("Results"):
                timestamp = _datetime.strptime(
                    remainder.lstrip('Results on '),
                    '%a, %d %b %Y %H:%M:%S %Z'
                )
                if person:
                    answers_by_person.append(person)

                    person = dict(timestamp=timestamp)
                    base_column_names, temp_column_names = [], []
                    prev_line_type, temp_column_first_index = None, None
                    seen_row = False
                else:
                    person['timestamp'] = timestamp
            else:
                print(f'Unknown line type: `{line}`, person: {person}')

        elif re.search("^\d{10}", line):   # data line
            seen_row = True
            prev_line_type = 'row'

            if temp_column_names:
                num_new_names = len(temp_column_names)
                # column_names = (base_column_names[:temp_column_first_index]
                #     + base_column_names[temp_column_first_index:index_right])
                # because of improper column `Controller name`. It is in spec, but
                #   not in rows
                column_names = (base_column_names[:temp_column_first_index]  # was temp_column_first_index ... - 1
                                + temp_column_names)
                # print(temp_column_names, base_column_names,
                      # temp_column_first_index, column_names, sep='\n')

            else:
                column_names = base_column_names

            print(i, line, column_names, temp_column_names, temp_column_first_index)
            row = get_row(line, column_names)

            if row['Label'] == 'instructions':
                person.setdefault('person', []).append(row)
                # print(f'added instr: {row}')
            elif row['Label'] == 'context_practice':
                continue
            elif row['Label'] in EXPERIMENT_LABELS:
                person.setdefault('data', []).append(row)
                # print(f'added exper: {row}')

    return answers_by_person


def filter_person(df,
    columns_to_drop=[
        'Order number of item', 'Inner element number', 'Label',
        'PennElementType', 'PennElementName',
        # 'Parameter', 'Value'
    ]
):
    return df.drop(columns=columns_to_drop).loc[0]


def rename_cols(df):
    df.rename(columns={"Results reception time": "Res_reception_t",
                       "MD5 hash of participant's IP address": "IP_hash"},
              inplace=True)


def filter_data(
        df, rows_to_keep=('Selector',),
        columns_to_keep_base=(
            "Results reception time", "MD5 hash of participant's IP address",
            "Value", "RT",
            "pair_id", "item_id", "type",
            "group", "context_id",
            "compl", "pos_matrix", 
        )
):
    columns_to_keep = [col for col in columns_to_keep_base
                       if col in df.columns]
    df = df.loc[df["PennElementType"].isin(rows_to_keep), columns_to_keep]
    rename_cols(df)
    return df


def add_cols_df(df, cols_values: Dict[str, Union[str, int]]):
    return df.assign(**cols_values)


def check_answers(_answers_by_person, include_person=None):
    if include_person is None:
        include_person = INCLUDE_PERSON

    answers_by_person = []
    print(include_person)
    for i, person in enumerate(_answers_by_person):
        if i >= EXCLUDE_FIRST and person.get('data'):
            if include_person:
                person['person'] = pd.DataFrame(person['person'])
            person['data'] = pd.DataFrame(person['data'])
            answers_by_person.append(person)
        else:
            print("Excluding:\t", i, person.keys(), person.get('timestamp'))
    return answers_by_person


def process_data(
    answers_by_person, items_name='item_id', include_person=None,
    filter_data_args={}
):
    if include_person is None:
        include_person = INCLUDE_PERSON
    
    print(include_person)

    answers_dfs = []
    persons_dfs = []
    

    print(f"in process_data:\n{answers_by_person}")
    for data_item in answers_by_person:
        # print(data_item.keys())
        data_df = filter_data(data_item['data'], **filter_data_args)
        
        print(f"PROCESS_DATA in for", data_item, data_df, sep='\n')

        if include_person:
            items_ordered = data_df[items_name].values.tolist()
            num_items = len(items_ordered)

            person_df = filter_person(data_item['person']).to_frame().T

            cols_to_add = {key: value for key, value in data_item.items()
                           if key not in ('person', 'data')}
            cols_to_add.update({'num_items': num_items})
            cols_to_add.update({f'item_id_{i}': item_id
                                for i, item_id in enumerate(items_ordered, start=1)}
            )
            # print(cols_to_add)
            person_df = add_cols_df(person_df, cols_to_add)
            rename_cols(person_df)

            persons_dfs.append(person_df)
        answers_dfs.append(data_df)

    answers = pd.concat(answers_dfs) if len(answers_dfs) > 1 else answers_dfs[0]

    if include_person:
        persons = pd.concat(persons_dfs) if len(persons_dfs) > 1 else persons_dfs[0]
        # add person indices
        persons.insert(0, 'person_id', range(1, len(persons) + 1))
        answers = answers.merge(
            persons.set_index(['Res_reception_t', 'IP_hash'])['person_id'],
            on=['Res_reception_t', 'IP_hash']
        )[
            ['person_id'] + answers.columns.to_list()
        ]
        
        # add group info to persons df
        if 'group' in persons.columns:
            persons = persons.merge(
                answers.groupby(['Res_reception_t', 'IP_hash'], as_index=True)['group'].first(),
                on=['Res_reception_t', 'IP_hash']
            )[
                persons.columns.to_list()[:6] + ['group'] + persons.columns.to_list()[6:]
            ]
    else:
        persons = []
    
    print(f"answers: {len(answers_dfs)}, persons: {len(persons_dfs)}")
    print(answers, persons, sep='\n')

    return answers, persons


# def save_data(df, path):
#     if path.exists():
#         print(f"File already exists at path `{path}`, trying other")
#         save_data()


def get_tables():
    lines = get_lines(results_path)
    _answers_by_person = parse_lines(lines)
    
    print(_answers_by_person)
    
    answers_by_person = check_answers(_answers_by_person)
    
    print(answers_by_person)
    
    answers, persons = process_data(
        answers_by_person, items_name='pair_id',
        filter_data_args=dict(rows_to_keep=args.name)
    )

    return answers, persons


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Parse pcibex result txt into participants and answers tables'
    )
    parser.add_argument('filename', metavar='file', type=str,
                        help='filename to parse in `./pcibex_results`')
    parser.add_argument('-F', '--folder', type=str, default=None,
                        help="folder name if it isn't `./pcibex_results`")
    parser.add_argument('-E', '--exclude', metavar='E', type=int, default=None,
                        help="exclude first E results (e.g. if it was us testing)")
    parser.add_argument('-L', '--labels', type=str, nargs='+',
                        default=('test', 'fillers', 'extraction', 'no-extraction', 'filler', 'filler_good', 'filler_bad'),
                        help="which pcibex labels represent experimental items")
    parser.add_argument('-n', '--name', type=str, nargs='+',
                        default=('Scale', 'Selector'),
                        help="what penn element types represent experimental items")
    parser.add_argument('-P', '--person', type=int, default=None,
                        help="whether to include person dataframe in results" +
                        "(depends on presence of person data in df)")
    args = parser.parse_args()
    print(args)

    EXCLUDE_FIRST = args.exclude or EXCLUDE_FIRST
    EXPERIMENT_LABELS = args.labels or EXPERIMENT_LABELS
    INCLUDE_PERSON = (bool(args.person) if args.person is not None
                      else INCLUDE_PERSON)
    RESULTS_FOLDER = Path(args.folder or RESULTS_FOLDER)
    RESULTS_FILE = args.filename or RESULTS_FILE
    results_path = RESULTS_FOLDER / Path(RESULTS_FILE)

    print(EXCLUDE_FIRST, EXPERIMENT_LABELS, INCLUDE_PERSON)

    answers, persons = get_tables()

    answers.to_csv(RESULTS_FOLDER / Path(ANSWERS_NAME), index=False)
    if INCLUDE_PERSON:
        persons.to_csv(RESULTS_FOLDER / Path(PERSONS_NAME), index=False)


    # blah blah lots of code ...

    sys.stdout = old_stdout
